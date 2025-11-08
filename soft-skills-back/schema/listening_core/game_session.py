from datetime import datetime
from typing import List, Optional, TypeVar
from uuid import UUID

from pydantic import BaseModel, field_serializer
from sqlmodel import SQLModel

from model.listening_core.game_session import GameSessionBase
from schema.base import BaseResponse, PaginatedResponse
from schema.listening_core.game_session_config import GameSessionConfigCreate, GameSessionConfigRead
from schema.listening_core.game_round import GameRoundReadSummary, RoundRecap
from enums.listening_game import GameStatus
from utils.serializers import serialize_datetime_without_microseconds
from utils.payloads_listening_game import (
    GAME_SESSION_CREATE_EXAMPLE,
    GAME_SESSION_READ_EXAMPLE,
    SESSION_RESULT_RESPONSE_EXAMPLE,
    GAME_SESSION_DETAIL_EXAMPLE,
    GAME_SESSION_UPDATE_EXAMPLE,
    GAME_SESSION_SUMMARY_EXAMPLE,
    ROUND_ADVANCE_RESPONSE_EXAMPLE,
    SESSION_FINISH_RESPONSE_EXAMPLE
)

T = TypeVar("T")


class GameSessionStartResponse(SQLModel):
    session_id: UUID
    status: GameStatus
    current_round: int
    started_at: Optional[datetime] = None
    round: GameRoundReadSummary

    @field_serializer("started_at", when_used="json")
    def serialize_started_at(self, v: datetime | None) -> str | None:
        return serialize_datetime_without_microseconds(v)

    model_config = {"from_attributes": True}


class GameSessionSummary(GameSessionBase):
    """Summary view of a game session for listing."""
    game_session_id: UUID
    created_at: datetime

    @field_serializer("created_at", when_used="json")
    def serialize_created_at(self, v: datetime) -> str:
        return serialize_datetime_without_microseconds(v)

    model_config = {
        "from_attributes": True,
        "json_schema_extra": {"example": GAME_SESSION_SUMMARY_EXAMPLE}
    }


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


class RoundAdvanceResponse(BaseModel):
    """Response schema for successful round advancement."""
    current_round: int

    model_config = {
        "json_schema_extra": {"example": ROUND_ADVANCE_RESPONSE_EXAMPLE}
    }


class SessionFinishResponse(BaseModel):
    """Response schema for finishing a game session."""
    session_completed: bool
    final_score: float
    final_max_score: float
    started_at: Optional[datetime] = None
    finished_at: Optional[datetime] = None

    @field_serializer("started_at", "finished_at", when_used="json")
    def serialize_datetime_fields(self, v: datetime | None) -> str | None:
        return serialize_datetime_without_microseconds(v)

    model_config = {
        "json_schema_extra": {"example": SESSION_FINISH_RESPONSE_EXAMPLE}
    }


class SessionResultResponse(BaseModel):
    """Response schema for full post-game recap."""
    session_completed: bool
    final_score: float
    final_max_score: float
    started_at: Optional[datetime] = None
    finished_at: Optional[datetime] = None
    total_rounds: int
    name: str
    rounds: List[RoundRecap]

    @field_serializer("started_at", "finished_at", when_used="json")
    def serialize_datetime_fields(self, v: datetime | None) -> str | None:
        return serialize_datetime_without_microseconds(v)

    model_config = {
        "json_schema_extra": {"example": SESSION_RESULT_RESPONSE_EXAMPLE}
    }


AdvanceNextRoundResponse = RoundAdvanceResponse

