from __future__ import annotations
from typing import Optional, Tuple
from uuid import UUID
import logging
from datetime import datetime, timezone
from sqlmodel import Session, select

from enums.listening_game import TeamAssignmentMode
from model.listening_core.room import Room, RoomStatus
from model.listening_core.room_member import RoomMember
from schema.listening_core.room_join import RoomJoinResult
from utils.errors import APIException, BadRequest, handle_db_error

from .room_service import RoomService
from .room_invite_service import RoomInviteService
from .team_service import TeamService
from .team_member_service import TeamMemberService

logger = logging.getLogger(__name__)


class RoomMemberService:
    def __init__(self):
        self.room_service = RoomService()
        self.invite_service = RoomInviteService()
        self.team_service = TeamService()
        self.team_member_service = TeamMemberService()

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
        mode_str = getattr(mode, "value", str(mode))

        if mode == TeamAssignmentMode.manual:
            return None, None, mode_str

        team_id, team_name = self.team_member_service.assign_random_if_unassigned(
            room_id, user_id, config.team_size, session
        )

        return team_id, team_name, mode_str
    
    def _assert_room_join_allowed(
        self, room: Room, room_id: UUID, user_id: UUID, session: Session
    ) -> None:

        #Allow join in lobby
        if room.status == RoomStatus.lobby:
            return
        
        #Allow join in active room if user is already a member
        if room.status == RoomStatus.active and self.get_room_member(room_id, user_id, session):
            return
        

        if room.status == RoomStatus.active:
            raise BadRequest("Room is already in progress. You cannot join now.")
        
        raise APIException("Room is not open for joining.")

    def join_room_with_token(
        self, room_id: UUID, user_id: UUID, token: str, session: Session
    ) -> RoomJoinResult:
        try:
            room = self.room_service.get_room(room_id, session)
            invite = self.invite_service.validate_invite_for_join(room_id, token, session)

            self._assert_room_join_allowed(room, room_id, user_id, session)

            room_member, is_new = self._get_or_create_room_member(room_id, user_id, session)

            team_id, team_name, mode_str = self._assign_team_if_automatic(
                room_id, user_id, session
            )   

            new_uses = self.invite_service.mark_used_atomically(invite.id, session)

            session.commit()
            session.refresh(room_member)

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
    
    def leave_room(
        self, room_id: UUID, user_id: UUID, session: Session
    ) -> None:
        try:
            room_member = self.get_room_member(room_id, user_id, session)
            if not room_member or not room_member.active:
                raise BadRequest("You are not a member of this room or you have already left.")
            
            room_member.active = False
            room_member.left_at = datetime.now(timezone.utc)
            session.add(room_member)

            removed_team_id = self.team_member_service.remove_user_from_team_in_room_if_exists(room_id, user_id, session)
            
            if removed_team_id:
                logger.info(f"User {user_id} left room {room_id} and was removed from team {removed_team_id}")
            else:
                logger.info(f"User {user_id} left room {room_id} (was not in any team)")

            session.commit()
        except APIException:
            raise
        except Exception as err:
            session.rollback()
            handle_db_error(err, "leave_room", error_type="commit")

