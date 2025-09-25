from uuid import uuid4

from uuid import UUID
from sqlmodel import SQLModel, Field
from sqlalchemy import UniqueConstraint, Index


class TeamScoreBase(SQLModel):
    points_total: int = Field(default=0)


class TeamScore(TeamScoreBase, table=True):
    __tablename__ = "listening_team_score"
    
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    game_id: UUID = Field(foreign_key="listening_game.id")
    team_id: UUID = Field(foreign_key="listening_team.id")
    
    __table_args__ = (
        UniqueConstraint("game_id", "team_id", name="uq_listening_team_score_game_team"),
        Index("ix_listening_team_score_game_points", "game_id", "points_total"),
    )
