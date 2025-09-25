from uuid import uuid4
from uuid import UUID
from sqlmodel import SQLModel, Field

from enums.listening_game import GameStatus


class GameBase(SQLModel):
    status: GameStatus = Field(default=GameStatus.active)
    current_round_number: int = Field(default=1)


class Game(GameBase, table=True):
    __tablename__ = "listening_game"
    
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    room_id: UUID = Field(
        foreign_key="listening_room.id",
        unique=True
    )
