from datetime import datetime
from typing import List, Optional, TypeVar

from pydantic import field_serializer
from uuid import UUID
from sqlmodel import SQLModel

from model.listening_core import RoomBase
from schema.base import BaseResponse, PaginatedResponse
from schema.listening_core.room_config import RoomConfigCreate, RoomConfigRead
from enums.listening_game import PromptType, Difficulty, RoomStatus
from utils.payloads_listening_game import (
    ROOM_CREATE_EXAMPLE,
    ROOM_READ_EXAMPLE, 
    ROOM_DETAIL_EXAMPLE
)
from utils.serializers import serialize_datetime_without_microseconds

T = TypeVar("T")

class RoomSummary(RoomBase):
    id: UUID
    max_players: int
    players_count: int
    created_at: datetime
    
    @field_serializer("created_at", when_used="json")
    def serialize_created_at(self, v: datetime) -> str:
        return serialize_datetime_without_microseconds(v)
    
    model_config = {"from_attributes": True}

class TeamSummary(SQLModel):
    id: UUID
    name: str
    member_count: int

class RoomCreate(RoomBase):
    config: Optional[RoomConfigCreate] = None
    
    model_config = {"json_schema_extra": {"example": ROOM_CREATE_EXAMPLE}}


class RoomRead(RoomSummary):
    started_at: Optional[datetime] = None
    finished_at: Optional[datetime] = None
    
    @field_serializer("started_at", "finished_at", when_used="json")
    def serialize_datetime_fields(self, v: datetime | None) -> str | None:
        return serialize_datetime_without_microseconds(v)
    
    model_config = {
        "from_attributes": True,
        "json_schema_extra": {"example": ROOM_READ_EXAMPLE}
    }


class RoomUpdate(SQLModel):
    name: Optional[str] = None
    status: Optional[RoomStatus] = None
    
    model_config = {"from_attributes": True}


class RoomDetail(RoomRead):
    config: RoomConfigRead
    teams: List[TeamSummary] = []
    
    model_config = {
        "from_attributes": True,
        "json_schema_extra": {"example": ROOM_DETAIL_EXAMPLE}
    }


class RoomResponse(BaseResponse[T]):
    pass


class RoomPaginatedResponse(PaginatedResponse):
    data: List[RoomSummary]
