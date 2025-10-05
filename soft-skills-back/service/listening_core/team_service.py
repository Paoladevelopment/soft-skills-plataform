from typing import List
from uuid import UUID
import random
from sqlmodel import Session, select, func, exists
from sqlalchemy.exc import MultipleResultsFound
from model.listening_core.team import Team
from model.listening_core.team_member import TeamMember
from model.listening_core.room_member import RoomMember
from schema.listening_core.room import TeamSummary
from utils.errors import APIException, Missing, Duplicate, handle_db_error
from utils.listening_game_constants import MIN_TEAMS_REQUIRED
from typing import Optional


class TeamService:
    DEFAULT_TEAM_NAMES = ("Team A", "Team B")

    def _teams_below_capacity(
        self, team_summaries: List[TeamSummary], team_size: int
    ) -> List[TeamSummary]:
        """Return only teams whose member_count is strictly less than team_size.
        Used for random assignment.
        """

        return [team for team in team_summaries if team.member_count < team_size]
    
    def _least_member_count(self, team_summaries: List[TeamSummary]) -> int:
        """Return the least member count among all teams.
        Used for random assignment.
        """
        return min(team.member_count for team in team_summaries)
    
    def _team_ids_with_member_count_equal_to(
        self, team_summaries: List[TeamSummary], member_count: int
    ) -> List[UUID]:
        """Return the team ids whose member_count is equal to the given member_count.
        Used for random assignment.
        """
        return [team.id for team in team_summaries if team.member_count == member_count]

    def _choose_random_id_from_list(self, list: List[UUID]) -> UUID:
        """Return a random id from the given list.
        Used for random assignment.
        """
        return random.choice(list)
    
    def _get_user_team_in_room(self, room_id: UUID, user_id: UUID, session: Session) -> Optional[Team]:
        try:
            return session.exec(
                select(Team)
                .join(TeamMember, Team.id == TeamMember.team_id)
                .where(Team.room_id == room_id, TeamMember.user_id == user_id)
            ).one_or_none()
        
        except MultipleResultsFound:
            raise Duplicate("User belongs to multiple teams in this room. Please contact support.")
        
        except Exception as err:
            handle_db_error(err, "_get_user_team_in_room", error_type="query")
    
    def get_teams_by_room(self, room_id: UUID, session: Session) -> List[Team]:
        """Get all teams for a specific room"""
        try:
            teams_query = select(Team).where(Team.room_id == room_id).order_by(Team.created_at.desc())
            teams = session.exec(teams_query).all()

            return teams
            
        except Exception as err:
            handle_db_error(err, "get_teams_by_room", error_type="query")
    
    def get_team_summaries(self, room_id: UUID, session: Session) -> List[TeamSummary]:
        """Get team summaries for a room.
        It returns the team id, name, and the number of members in the team.
        """
        try:
            teams_with_counts = session.exec(
                select(
                    Team.id,
                    Team.name,
                    func.count(TeamMember.user_id).label('member_count')
                )
                .outerjoin(TeamMember, Team.id == TeamMember.team_id)
                .where(Team.room_id == room_id)
                .group_by(Team.id, Team.name)
                .order_by(Team.created_at.desc())
            ).all()
            
            team_summaries = [
                TeamSummary(id=team.id, name=team.name, member_count=team.member_count)
                for team in teams_with_counts
            ]
            
            return team_summaries
            
        except Exception as err:
            handle_db_error(err, "get_team_summaries", error_type="query")
    
    def get_team_members_count(self, team_id: UUID, session: Session) -> int:
        try:
            return session.scalar(
                select(func.count())
                .select_from(TeamMember)
                .where(TeamMember.team_id == team_id)
            ) or 0

        except Exception as err:
            handle_db_error(err, "get_team_members_count", error_type="query")
    
    def get_team(self, team_id: UUID, session: Session) -> Team:
        try:
            team = session.get(Team, team_id)
            
            if not team:
                raise Missing(f"Team with ID {team_id} not found")
            
            return team
            
        except APIException as api_error:
            raise api_error
        except Exception as err:
            handle_db_error(err, "get_team", error_type="query")
    
    def update_team(self, team_id: UUID, name: str, session: Session) -> Team:
        try:
            team = self.get_team(team_id, session)
            team.name = name
            
            session.add(team)
            session.commit()
            session.refresh(team)
            
            return team
            
        except APIException:
            raise
        except Exception as err:
            session.rollback()
            handle_db_error(err, "update_team", error_type="commit")
    
    def create_default_teams(self, room_id: UUID, session: Session) -> None:
        try:
            session.add_all([
                Team(room_id=room_id, name=name) for name in self.DEFAULT_TEAM_NAMES
            ])

        except Exception as err:
            handle_db_error(err, "create_default_teams", error_type="write")
    
    def pick_team_id_for_random_assignment(self, room_id: UUID, team_size: int, session: Session) -> UUID:
        try:
            team_summaries = self.get_team_summaries(room_id, session)
            if len(team_summaries) < MIN_TEAMS_REQUIRED:
                raise Missing("Room does not have enough teams configured")
            
            eligible_teams = self._teams_below_capacity(team_summaries, team_size)
            if not eligible_teams:
                raise Duplicate("All teams have reached the capacity")
            
            least_member_count = self._least_member_count(eligible_teams)
            candidates_ids = self._team_ids_with_member_count_equal_to(eligible_teams, least_member_count)
            
            return self._choose_random_id_from_list(candidates_ids)
        
        except APIException as api_error:
            raise api_error
        
        except Exception as err:
            handle_db_error(err, "pick_team_id_for_random_assignment", error_type="query")

