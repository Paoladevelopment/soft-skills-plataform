from __future__ import annotations
from typing import Optional, Tuple
from uuid import UUID

from sqlmodel import Session, select

from model.listening_core.team import Team
from model.listening_core.team_member import TeamMember
from .team_service import TeamService
from .room_service import RoomService
from utils.errors import APIException, BadRequest, Missing, Duplicate, handle_db_error
from utils.helpers import is_user_active_in_room


class TeamMemberService:
    def __init__(self):
        self.team_service = TeamService()
        self.room_service = RoomService()
    
    def _get_team_member(
        self, team_id: UUID, user_id: UUID, session: Session
    ) -> Optional[TeamMember]:
        try:
            return session.get(TeamMember, (team_id, user_id))
            
        except Exception as err:
            handle_db_error(err, "_get_team_member", error_type="query")
    

    def assign_random_if_unassigned(
        self, room_id: UUID, user_id: UUID, team_size: int, session: Session
    ) -> Tuple[UUID, str]:
        """
        If the user already belongs to a team in the room, return that (id, name).
        Otherwise, assign them to a random eligible team within capacity and return (id, name).
        """
        try:
            current_team: Optional[Team] = self.team_service._get_user_team_in_room(
                room_id, user_id, session
            )
            if current_team:
                return current_team.id, current_team.name

            team_id = self.team_service.pick_team_id_for_random_assignment(
                room_id=room_id, 
                team_size=team_size, 
                session=session
            )

            session.add(TeamMember(team_id=team_id, user_id=user_id))

            team = self.team_service.get_team(team_id, session)
            return team.id, team.name

        except Exception as err:
            handle_db_error(err, "assign_random_if_unassigned", error_type="query")

    def remove_user_from_team_in_room_if_exists(
        self, room_id: UUID, user_id: UUID, session: Session
    ) -> Optional[UUID]:
        """
        Remove the user's team membership in this room, if any.
        Returns the removed team_id, or None if no team membership existed.
        """
        try:
            team_member = session.exec(
                select(TeamMember)
                .join(Team, Team.id == TeamMember.team_id)
                .where(Team.room_id == room_id, TeamMember.user_id == user_id)
            ).first()

            if not team_member:
                return None

            removed_team_id = team_member.team_id
            session.delete(team_member)
            
            return removed_team_id

        except Exception as err:
            handle_db_error(err, "remove_from_room_if_exists", error_type="query")
    
    def join_team_manually(
        self, room_id: UUID, team_id: UUID, user_id: UUID, session: Session
    ) -> None:
        try:
            if not is_user_active_in_room(room_id, user_id, session):
                raise BadRequest("You must join the room before selecting a team.")

            team = self.team_service.get_team(team_id, session)
            if team.room_id != room_id:
                raise Missing("Team does not belong to this room.")

            existing_team = self.team_service._get_user_team_in_room(room_id, user_id, session)

            if existing_team and existing_team.id != team_id:
                raise Duplicate("You already belong to a team in this room. Leave it before joining another.")
            
            if existing_team and existing_team.id == team_id:
                return

            config = self.room_service.get_config(room_id, session)

            current_count = self.team_service.get_team_members_count(team_id, session)
            if current_count >= config.team_size:
                raise Duplicate("This team is full. Please choose another team.")

            session.add(
                TeamMember(team_id=team_id, user_id=user_id)
            )
            session.commit()

        except APIException:
            raise
        except Exception as err:
            session.rollback()
            handle_db_error(err, "join_team_manually", error_type="commit")
    
    def leave_team_manually(
        self, room_id: UUID, team_id: UUID, user_id: UUID, session: Session
    ) -> UUID:
        try:
            if not is_user_active_in_room(room_id, user_id, session):
                raise BadRequest("You must be an active member of the room to leave a team.")
            
            team = self.team_service.get_team(team_id, session)
            if team.room_id != room_id:
                raise Missing("Team does not belong to this room.")

            team_member = self._get_team_member(team_id, user_id, session)
            if not team_member:
                raise BadRequest("You are not member of this team.")
    
            session.delete(team_member)
            session.commit()
            return team_id

        except APIException:
            raise
        except Exception as err:
            session.rollback()
            handle_db_error(err, "leave_team_manually", error_type="commit")
        
