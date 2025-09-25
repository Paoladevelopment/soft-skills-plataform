from datetime import datetime
from uuid import UUID
from pydantic import field_serializer

from model.listening_core import InviteTokenBase
from utils.serializers import serialize_datetime_without_microseconds


class InviteTokenRead(InviteTokenBase):
    id: UUID
    room_id: UUID
    used_by_user_id: UUID | None = None
    
    @field_serializer("expires_at", when_used="json")
    def serialize_datetime_fields(self, v: datetime | None) -> str | None:
        return serialize_datetime_without_microseconds(v)
    
    model_config = {"from_attributes": True}
