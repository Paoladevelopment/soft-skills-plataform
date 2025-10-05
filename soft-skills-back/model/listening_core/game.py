from uuid import UUID, uuid4
from datetime import datetime, timezone
from sqlmodel import SQLModel, Field, TIMESTAMP

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
