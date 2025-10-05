from uuid import UUID, uuid4
from datetime import datetime, timezone
from sqlmodel import SQLModel, Field, TIMESTAMP
from sqlalchemy import UniqueConstraint, Index

from enums.listening_game import RoundTeamStatus, PromptType, AudioLength, Difficulty


class RoundTeamBase(SQLModel):
    listener_replay_count: int = Field(default=0)
    prompt_type: PromptType
    audio_length: AudioLength = Field(default=AudioLength.short)
    difficulty: Difficulty
    status: RoundTeamStatus = Field(default=RoundTeamStatus.pending)


class RoundTeam(RoundTeamBase, table=True):
    __tablename__ = "listening_round_team"
    
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    round_id: UUID = Field(foreign_key="listening_round.id")
    team_id: UUID = Field(foreign_key="listening_team.id")
    listener_user_id: UUID = Field(foreign_key="users.user_id")
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
        UniqueConstraint("round_id", "team_id", name="uq_listening_round_team_unique"),
        Index("ix_listening_round_team", "round_id", "team_id"),
    )
