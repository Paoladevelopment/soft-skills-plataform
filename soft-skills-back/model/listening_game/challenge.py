from uuid import uuid4
from datetime import datetime, timezone
from uuid import UUID
from sqlmodel import SQLModel, Field, Column, JSON, TIMESTAMP


class ChallengeBase(SQLModel):
    audio_text: str
    forbidden_words: list[str] = Field(default_factory=list)
    answer_choices: list[str] = Field(default_factory=list)
    correct_answer_server_only: str


class Challenge(ChallengeBase, table=True):
    __tablename__ = "listening_challenge"
    
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
    forbidden_words: list[str] = Field(
        default_factory=list,
        sa_column=Column(JSON)
    )
    answer_choices: list[str] = Field(
        default_factory=list,
        sa_column=Column(JSON)
    )