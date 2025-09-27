from uuid import uuid4
from datetime import datetime, timezone
from uuid import UUID
from sqlmodel import SQLModel, Field, TIMESTAMP
from sqlalchemy import UniqueConstraint, Index


class TeamScoreBase(SQLModel):
    points_total: int = Field(default=0)


class TeamScore(TeamScoreBase, table=True):
    __tablename__ = "listening_team_score"
    
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    game_id: UUID = Field(foreign_key="listening_game.id")
    team_id: UUID = Field(foreign_key="listening_team.id")
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_type=TIMESTAMP(timezone=True)
    )
    updated_at: datetime | None = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column_kwargs={
            "onupdate": lambda: datetime.now(timezone.utc),
        },
        sa_type=TIMESTAMP(timezone=True),
    )
    
    __table_args__ = (
        UniqueConstraint("game_id", "team_id", name="uq_listening_team_score_game_team"),
        Index("ix_listening_team_score_game_points", "game_id", "points_total"),
    )
