from datetime import datetime
from uuid import UUID
from typing import Optional, TypeVar
from pydantic import field_serializer

from schema.base import BaseResponse
from model.listening_core import RoomInviteBase
from utils.serializers import serialize_datetime_without_microseconds

T = TypeVar("T")

class RoomInviteCreate(RoomInviteBase):
    pass

class RoomInviteRead(RoomInviteBase):
    id: UUID
    room_id: UUID
    created_by: UUID
    created_at: datetime
    updated_at: Optional[datetime] = None
    uses: int
    revoked: bool
    
    @field_serializer("expires_at", "created_at", "updated_at", when_used="json")
    def serialize_datetime_fields(self, v: datetime | None) -> str | None:
        return serialize_datetime_without_microseconds(v)
    
    model_config = {"from_attributes": True}

class RoomInviteWithToken(RoomInviteRead):
    token: str

class RoomInviteResponse(BaseResponse[T]):
    pass