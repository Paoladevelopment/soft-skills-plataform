from uuid import uuid4
from datetime import datetime, timezone
from uuid import UUID
from sqlmodel import SQLModel, Field, TIMESTAMP


class RoundTeamScoreBase(SQLModel):
    is_correct: bool
    base_points: int
    speed_bonus: int
    penalties: int
    total_points: int


class RoundTeamScore(RoundTeamScoreBase, table=True):
    __tablename__ = "listening_round_team_score"
    
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    round_team_id: UUID = Field(
        foreign_key="listening_round_team.id",
        unique=True
    )
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
