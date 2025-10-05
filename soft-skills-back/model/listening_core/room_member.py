from uuid import UUID, uuid4
from datetime import datetime, timezone
from sqlmodel import SQLModel, Field, TIMESTAMP, Index
from sqlalchemy import UniqueConstraint

class RoomMemberBase(SQLModel):
    active: bool = Field(default=True)


class RoomMember(RoomMemberBase, table=True):
    __tablename__ = "listening_room_member"
    
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    room_id: UUID = Field(foreign_key="listening_room.id")
    user_id: UUID = Field(foreign_key="users.user_id")
    joined_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_type=TIMESTAMP(timezone=True)
    )
    left_at: datetime | None = Field(
        default=None,
        sa_type=TIMESTAMP(timezone=True)
    )
    
    __table_args__ = (
        Index("idx_room_member_room_active", "room_id", "active"),
        UniqueConstraint("room_id", "user_id", name="uq_room_member_room_user"),
    )