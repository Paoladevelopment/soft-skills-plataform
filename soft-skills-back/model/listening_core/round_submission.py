from uuid import UUID, uuid4
from datetime import datetime, timezone
from typing import Optional, Dict, Any

from sqlalchemy import UniqueConstraint
from sqlmodel import SQLModel, Field, TIMESTAMP, Column, JSON, Relationship

from enums.listening_game import PlayMode, PromptType


class RoundSubmissionBase(SQLModel):
    """Base model for round submission."""
    play_mode: PlayMode
    prompt_type: Optional[PromptType] = None
    is_correct: bool = Field(default=False)
    feedback_short: Optional[str] = Field(default=None)
    client_elapsed_ms: Optional[int] = None
    idempotency_key: Optional[str] = Field(default=None)


class RoundSubmission(RoundSubmissionBase, table=True):
    __tablename__ = "listening_round_submission"

    round_submission_id: UUID = Field(default_factory=uuid4, primary_key=True)

    game_session_id: UUID = Field(
        foreign_key="listening_game_session.game_session_id",
        index=True
    )
    game_round_id: UUID = Field(
        foreign_key="listening_game_round.game_round_id",
        index=True
    )
    user_id: UUID = Field(
        foreign_key="users.user_id",
        index=True
    )

    submitted_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_type=TIMESTAMP(timezone=True)
    )

    answer_payload: Optional[Dict[str, Any]] = Field(
        default=None,
        sa_column=Column(JSON)
    )

    game_session: "GameSession" = Relationship(back_populates="submissions")
    game_round: "GameRound" = Relationship(back_populates="submissions")

    __table_args__ = (
        UniqueConstraint("game_round_id", name="uq_submission_per_round"),
        UniqueConstraint("game_round_id", "idempotency_key", name="uq_submission_idempotency"),
    )

