from uuid import UUID, uuid4
from datetime import datetime, timezone
from typing import Optional
from sqlmodel import SQLModel, Field, TIMESTAMP
from sqlalchemy import Column, String, Index


class RoomInviteBase(SQLModel):
    expires_at: Optional[datetime] = None
    max_uses: Optional[int] = None


class RoomInvite(RoomInviteBase, table=True):
    __tablename__ = "listening_room_invite"
    
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    room_id: UUID = Field(foreign_key="listening_room.id", index=True)
    created_by: UUID = Field(foreign_key="users.user_id")

    token_hash: str = Field(sa_column=Column(String(255), unique=True))

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
    expires_at: datetime | None = Field(
        default=None,
        sa_type=TIMESTAMP(timezone=True)
    )
    max_uses: int | None = Field(default=None)
    uses: int = Field(default=0)
    revoked: bool = Field(default=False) 