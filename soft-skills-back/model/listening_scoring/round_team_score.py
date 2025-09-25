from uuid import uuid4

from uuid import UUID
from sqlmodel import SQLModel, Field


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
