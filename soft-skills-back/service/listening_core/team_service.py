from typing import List
from uuid import UUID

from sqlmodel import Session, select, func
from model.listening_core.team import Team
from model.listening_core.team_member import TeamMember
from schema.listening_core.room import TeamSummary
from utils.errors import APIException, Missing, handle_db_error


class TeamService:
    def get_teams_by_room(self, room_id: UUID, session: Session) -> List[Team]:
        """Get all teams for a specific room"""
        try:
            teams_query = select(Team).where(Team.room_id == room_id)
            teams = session.exec(teams_query).all()
            return teams
            
        except Exception as err:
            handle_db_error(err, "get_teams_by_room", error_type="query")
    
    def get_team_summaries(self, room_id: UUID, session: Session) -> List[TeamSummary]:
        """Get team summaries for a room (used in room detail view)"""
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
            ).all()
            
            team_summaries = [
                TeamSummary(id=team.id, name=team.name, member_count=team.member_count)
                for team in teams_with_counts
            ]
            
            return team_summaries
            
        except Exception as err:
            handle_db_error(err, "get_team_summaries", error_type="query")
    
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
    
    def create_team(self, room_id: UUID, name: str, session: Session) -> Team:
        try:
            new_team = Team(room_id=room_id, name=name)
            session.add(new_team)
            session.commit()
            session.refresh(new_team)
            
            return new_team
            
        except Exception as err:
            session.rollback()
            handle_db_error(err, "create_team", error_type="commit")
    
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
    
    def delete_team(self, team_id: UUID, session: Session) -> bool:
        try:
            team = self.get_team(team_id, session)
            session.delete(team)
            session.commit()
            
            return True
            
        except APIException:
            raise
        except Exception as err:
            session.rollback()
            handle_db_error(err, "delete_team", error_type="commit")
