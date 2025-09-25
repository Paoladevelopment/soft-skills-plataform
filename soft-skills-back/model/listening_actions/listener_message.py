from uuid import uuid4
from datetime import datetime, timezone
from uuid import UUID
from sqlmodel import SQLModel, Field, Column, JSON, TIMESTAMP


class ListenerMessageBase(SQLModel):
    content: str
    violations: list[str] | None = Field(default=None)


class ListenerMessage(ListenerMessageBase, table=True):
    __tablename__ = "listening_listener_message"
    
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    round_team_id: UUID = Field(
        foreign_key="listening_round_team.id"
    )
    author_user_id: UUID = Field(foreign_key="users.user_id")
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_type=TIMESTAMP(timezone=True)
    )
    violations: list[str] | None = Field(
        default=None,
        sa_column=Column(JSON)
    )