from uuid import uuid4
from uuid import UUID
from sqlmodel import SQLModel, Field
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
    
    __table_args__ = (
        UniqueConstraint("round_id", "team_id", name="uq_listening_round_team_unique"),
        Index("ix_listening_round_team", "round_id", "team_id"),
    )
