from uuid import uuid4
from datetime import datetime, timezone
from uuid import UUID
from sqlmodel import SQLModel, Field, TIMESTAMP
from sqlalchemy import Index

from enums.listening_game import PenaltyReason


class PenaltyBase(SQLModel):
    reason: PenaltyReason
    points_delta: int
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )


class Penalty(PenaltyBase, table=True):
    __tablename__ = "listening_penalty"
    
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    round_team_id: UUID = Field(
        foreign_key="listening_round_team.id"
    )
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_type=TIMESTAMP(timezone=True)
    )
    
    __table_args__ = (
        Index("ix_listening_penalty_round_team", "round_team_id"),
    )