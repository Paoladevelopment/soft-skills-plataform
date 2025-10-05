from datetime import datetime
from typing import List, Optional
from uuid import UUID

from pydantic import field_serializer

from model.listening_core.room_member import RoomMemberBase
from schema.base import BaseResponse, PaginatedResponse
from utils.serializers import serialize_datetime_without_microseconds

class RoomMemberRead(RoomMemberBase):
    id: UUID
    room_id: UUID
    user_id: UUID
    joined_at: datetime
    left_at: Optional[datetime] = None
    
    @field_serializer("joined_at", "left_at", when_used="json")
    def serialize_datetime_fields(self, v: datetime | None) -> str | None:
        return serialize_datetime_without_microseconds(v)
    
    model_config = {"from_attributes": True}


class RoomMemberResponse(BaseResponse[RoomMemberRead]):
    pass


class RoomMemberPaginatedResponse(PaginatedResponse):
    data: List[RoomMemberRead]
