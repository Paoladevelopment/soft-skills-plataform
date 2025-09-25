from uuid import uuid4
from datetime import datetime, timezone
from uuid import UUID
from sqlmodel import SQLModel, Field, TIMESTAMP


class InviteTokenBase(SQLModel):
    token: str = Field(unique=True)
    expires_at: datetime


class InviteToken(InviteTokenBase, table=True):
    __tablename__ = "listening_invite_token"
    
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    room_id: UUID = Field(foreign_key="listening_room.id")
    expires_at: datetime = Field(sa_type=TIMESTAMP(timezone=True))
    used_by_user_id: UUID | None = Field(
        default=None,
        foreign_key="users.user_id"
    )
