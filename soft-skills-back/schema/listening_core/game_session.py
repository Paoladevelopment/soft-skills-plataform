from datetime import datetime
from typing import List, Optional, TypeVar
from uuid import UUID

from pydantic import field_serializer
from sqlmodel import SQLModel

from model.listening_core.game_session import GameSessionBase
from schema.base import BaseResponse, PaginatedResponse
from schema.listening_core.game_session_config import GameSessionConfigCreate, GameSessionConfigRead
from enums.listening_game import GameStatus
from utils.serializers import serialize_datetime_without_microseconds
from utils.payloads_listening_game import (
    GAME_SESSION_CREATE_EXAMPLE,
    GAME_SESSION_READ_EXAMPLE,
    GAME_SESSION_DETAIL_EXAMPLE,
    GAME_SESSION_UPDATE_EXAMPLE
)

T = TypeVar("T")


class GameSessionSummary(GameSessionBase):
    """Summary view of a game session for listing."""
    id: UUID
    created_at: datetime

    @field_serializer("created_at", when_used="json")
    def serialize_created_at(self, v: datetime) -> str:
        return serialize_datetime_without_microseconds(v)

    model_config = {"from_attributes": True}


class GameSessionCreate(SQLModel):
    """Schema for creating a new game session. Only name and config are allowed."""
    name: str
    config: Optional[GameSessionConfigCreate] = None

    model_config = {
        "extra": "forbid",
        "from_attributes": True,
        "json_schema_extra": {"example": GAME_SESSION_CREATE_EXAMPLE}
    }


class GameSessionRead(GameSessionSummary):
    """Full read view of a game session."""
    user_id: UUID
    started_at: Optional[datetime] = None
    finished_at: Optional[datetime] = None

    @field_serializer("started_at", "finished_at", when_used="json")
    def serialize_datetime_fields(self, v: datetime | None) -> str | None:
        return serialize_datetime_without_microseconds(v)

    model_config = {
        "from_attributes": True,
        "json_schema_extra": {"example": GAME_SESSION_READ_EXAMPLE}
    }


class GameSessionDetail(GameSessionRead):
    """Detailed view including configuration."""
    config: GameSessionConfigRead

    model_config = {
        "from_attributes": True,
        "json_schema_extra": {"example": GAME_SESSION_DETAIL_EXAMPLE}
    }


class GameSessionUpdate(SQLModel):
    """Schema for updating game session properties."""
    name: Optional[str] = None
    status: Optional[GameStatus] = None

    model_config = {
        "from_attributes": True,
        "json_schema_extra": {"example": GAME_SESSION_UPDATE_EXAMPLE}
    }


class GameSessionResponse(BaseResponse[T]):
    """Generic response wrapper for game session data."""
    pass


class GameSessionPaginatedResponse(PaginatedResponse):
    """Paginated response for game session lists."""
    data: List[GameSessionSummary]

