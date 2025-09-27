from uuid import uuid4
from datetime import datetime, timezone
from uuid import UUID
from sqlmodel import SQLModel, Field, TIMESTAMP
from sqlalchemy import Index, Column, String

from enums.listening_game import RoomStatus


class RoomBase(SQLModel):
    status: RoomStatus = Field(default=RoomStatus.lobby)
    name: str


class Room(RoomBase, table=True):
    __tablename__ = "listening_room"
    
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    name: str = Field(sa_column=Column(String(255)))
    owner_user_id: UUID = Field(foreign_key="users.user_id")
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
    started_at: datetime | None = Field(
        default=None,
        sa_type=TIMESTAMP(timezone=True)
    )
    finished_at: datetime | None = Field(
        default=None,
        sa_type=TIMESTAMP(timezone=True)
    )
    
    __table_args__ = (
        Index("ix_listening_room_status_created", "status", "created_at"),
    )
