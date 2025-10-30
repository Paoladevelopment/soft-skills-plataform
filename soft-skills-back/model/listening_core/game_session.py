from uuid import UUID, uuid4
from datetime import datetime, timezone
from sqlmodel import SQLModel, Field, TIMESTAMP, Relationship
from sqlalchemy import Index, Column, String
from typing import List
from enums.listening_game import GameStatus


class GameSessionBase(SQLModel):
    status: GameStatus = Field(default=GameStatus.pending)
    name: str
    current_round: int = Field(default=1)
    total_score: float = Field(default=0.0)


class GameSession(GameSessionBase, table=True):
    __tablename__ = "listening_game_session"
    
    game_session_id: UUID = Field(default_factory=uuid4, primary_key=True)
    name: str = Field(sa_column=Column(String(255)))
    user_id: UUID = Field(foreign_key="users.user_id")
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
    
    config: "GameSessionConfig" = Relationship(
        back_populates="game_session",
        sa_relationship_kwargs={"lazy": "selectin", "cascade": "all, delete"}
    )

    rounds: List["GameRound"] = Relationship(
        back_populates="game_session",
        sa_relationship_kwargs={"lazy": "selectin", "cascade": "all, delete"}
    )
    
    __table_args__ = (
        Index("ix_listening_game_session_status_created", "status", "created_at"),
    )
