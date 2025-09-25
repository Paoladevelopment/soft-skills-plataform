from uuid import uuid4
from uuid import UUID
from sqlmodel import SQLModel, Field
from sqlalchemy import UniqueConstraint


class TeamBase(SQLModel):
    name: str


class Team(TeamBase, table=True):
    __tablename__ = "listening_team"
    
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    room_id: UUID = Field(foreign_key="listening_room.id")
    
    __table_args__ = (
        UniqueConstraint("room_id", "name", name="uq_listening_team_room_name"),
    )
