from uuid import uuid4
from datetime import datetime, timezone
from uuid import UUID
from sqlmodel import SQLModel, Field, TIMESTAMP
from sqlalchemy import UniqueConstraint


class TeamBase(SQLModel):
    name: str


class Team(TeamBase, table=True):
    __tablename__ = "listening_team"
    
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    room_id: UUID = Field(foreign_key="listening_room.id")
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
    
    __table_args__ = (
        UniqueConstraint("room_id", "name", name="uq_listening_team_room_name"),
    )
