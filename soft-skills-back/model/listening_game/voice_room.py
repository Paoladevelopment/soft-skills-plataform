from uuid import uuid4
from uuid import UUID
from sqlmodel import SQLModel, Field

from enums.listening_game import VoiceProvider


class VoiceRoomBase(SQLModel):
    provider: VoiceProvider
    join_url: str


class VoiceRoom(VoiceRoomBase, table=True):
    __tablename__ = "listening_voice_room"
    
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    round_team_id: UUID = Field(
        foreign_key="listening_round_team.id",
        unique=True
    )