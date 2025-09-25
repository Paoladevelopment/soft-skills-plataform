from uuid import uuid4
from datetime import datetime, timezone
from uuid import UUID
from sqlmodel import SQLModel, Field, TIMESTAMP
from sqlalchemy import UniqueConstraint, Index

from enums.listening_game import RoundStatus


class RoundBase(SQLModel):
    round_number: int
    status: RoundStatus = Field(default=RoundStatus.pending)


class Round(RoundBase, table=True):
    __tablename__ = "listening_round"
    
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    game_id: UUID = Field(foreign_key="listening_game.id")
    started_at: datetime | None = Field(
        default=None,
        sa_type=TIMESTAMP(timezone=True)
    )
    deadline_at: datetime | None = Field(
        default=None,
        sa_type=TIMESTAMP(timezone=True)
    )
    ended_at: datetime | None = Field(
        default=None,
        sa_type=TIMESTAMP(timezone=True)
    )
    
    __table_args__ = (
        UniqueConstraint("game_id", "round_number", name="uq_listening_round_game_num"),
        Index("ix_listening_round_game_num", "game_id", "round_number"),
    )
