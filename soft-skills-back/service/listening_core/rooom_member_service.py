from __future__ import annotations
from typing import Optional, Tuple
from uuid import UUID
import logging

from sqlmodel import Session, select

from enums.listening_game import TeamAssignmentMode
from model.listening_core.room_member import RoomMember
from model.listening_core.team_member import TeamMember
from model.listening_core.team import Team
from schema.listening_core.room_join import RoomJoinResult
from utils.errors import APIException, handle_db_error

from .room_service import RoomService
from .room_invite_service import RoomInviteService
from .team_service import TeamService

logger = logging.getLogger(__name__)


class RoomMemberService:
    def __init__(self):
        self.room_service = RoomService()
        self.invite_service = RoomInviteService()
        self.team_service = TeamService()

    def get_room_member(
        self, room_id: UUID, user_id: UUID, session: Session
    ) -> Optional[RoomMember]:
        """
        Retrieve the room membership for a user (active or inactive).
        Returns None if no membership exists.
        """
        try:
            return session.exec(
                select(RoomMember).where(
                    RoomMember.room_id == room_id,
                    RoomMember.user_id == user_id,
                )
            ).first()

        except Exception as err:
            handle_db_error(err, "get_room_member", error_type="query")

    def _get_or_create_room_member(
        self, room_id: UUID, user_id: UUID, session: Session
    ) -> Tuple[RoomMember, bool]:
        try:
            member = self.get_room_member(room_id, user_id, session)
            if not member:
                member = RoomMember(room_id=room_id, user_id=user_id, active=True)
                session.add(member)

                return member, True
            
            if not member.active:
                member.active = True
                member.left_at = None
                session.add(member)
            
            return member, False

        except Exception as err:
            handle_db_error(err, "_get_or_create_room_member", error_type="query")

    def _assign_team_if_automatic(
        self, room_id: UUID, user_id: UUID, session: Session
    ) -> Tuple[Optional[UUID], Optional[str], str]:
    
        config = self.room_service.get_config(room_id, session)
        mode = config.team_assingment_mode

        if mode == TeamAssignmentMode.manual:
            return None, None, "manual"

        current_team: Optional[Team] = self.team_service._get_user_team_in_room(
            room_id, user_id, session
        )

        if current_team:
            mode_str = getattr(mode, "value", str(mode))
            return current_team.id, current_team.name, mode_str

        team_id = self.team_service.pick_team_id_for_random_assignment(
            room_id=room_id,
            team_size=config.team_size,
            session=session,
        )

        session.add(TeamMember(team_id=team_id, user_id=user_id))

        team = self.team_service.get_team(team_id, session)
        mode_str = getattr(mode, "value", str(mode))

        return team.id, team.name, mode_str

    def join_room_with_token(
        self, room_id: UUID, user_id: UUID, token: str, session: Session
    ) -> RoomJoinResult:
        try:
            room = self.room_service.get_room(room_id, session)
            invite = self.invite_service.validate_invite_for_join(room_id, token, session)

            room_member, is_new = self._get_or_create_room_member(room_id, user_id, session)

            team_id, team_name, mode_str = self._assign_team_if_automatic(
                room_id, user_id, session
            )   

            session.commit()
            session.refresh(room_member)

            new_uses = self.invite_service.mark_used_atomically(invite.id, session)
            logger.info(f"Invite {invite.id} used — now at {new_uses} uses")

            return RoomJoinResult(
                room_id=room.id,
                is_new_member=is_new,
                assignment_mode=mode_str,
                team_id=team_id,
                team_name=team_name,
            )

        except APIException:
            raise
        except Exception as err:
            session.rollback()
            handle_db_error(err, "join_room_with_token", error_type="commit")

