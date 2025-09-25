from uuid import uuid4
from datetime import datetime, timezone

from uuid import UUID
from sqlmodel import SQLModel, Field, Column, JSON, TIMESTAMP


class EventLogBase(SQLModel):
    type: str
    payload: dict = Field(default_factory=dict)
    occurred_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )


class EventLog(EventLogBase, table=True):
    __tablename__ = "listening_event_log"
    
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    game_id: UUID = Field(foreign_key="listening_game.id")
    round_id: UUID | None = Field(
        default=None,
        foreign_key="listening_round.id"
    )
    round_team_id: UUID | None = Field(
        default=None,
        foreign_key="listening_round_team.id"
    )
    actor_user_id: UUID | None = Field(
        default=None,
        foreign_key="users.user_id"
    )
    payload: dict = Field(
        default_factory=dict,
        sa_column=Column(JSON)
    )
    occurred_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_type=TIMESTAMP(timezone=True)
    )
