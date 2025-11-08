from uuid import UUID, uuid4
from datetime import datetime, timezone
from typing import Optional, List

from sqlalchemy import Index, UniqueConstraint, func
from sqlmodel import SQLModel, Field, TIMESTAMP, Relationship

from enums.listening_game import GameRoundStatus, PlayMode, PromptType


class GameRoundBase(SQLModel):
    round_number: int
    status: GameRoundStatus = Field(default=GameRoundStatus.queued)

    play_mode: Optional[PlayMode] = Field(default=None)
    prompt_type: Optional[PromptType] = Field(default=None)

    score: float | None = Field(default=None)
    max_score: float = Field(default=10.0)
    replays_used: int = Field(default=0)


class GameRound(GameRoundBase, table=True):
    __tablename__ = "listening_game_round"

    game_round_id: UUID = Field(default_factory=uuid4, primary_key=True)
    game_session_id: UUID = Field(foreign_key="listening_game_session.game_session_id", index=True)
    challenge_id: UUID | None = Field(default=None, foreign_key="listening_challenge.challenge_id")

    prepared_at: datetime | None = Field(default=None, sa_type=TIMESTAMP(timezone=True))
    started_at: datetime | None = Field(default=None, sa_type=TIMESTAMP(timezone=True))
    ended_at: datetime | None = Field(default=None, sa_type=TIMESTAMP(timezone=True))

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
    
    game_session: "GameSession" = Relationship(back_populates="rounds")
    challenge: Optional["Challenge"] = Relationship(back_populates="rounds")
    submissions: List["RoundSubmission"] = Relationship(
        back_populates="game_round",
        sa_relationship_kwargs={"cascade": "all, delete"}
    )

    __table_args__ = (
        UniqueConstraint("game_session_id", "round_number", name="uq_round_session_number"),
        Index("ix_round_session_status", "game_session_id", "status"),
        Index("ix_round_session_number", "game_session_id", "round_number"),
    )