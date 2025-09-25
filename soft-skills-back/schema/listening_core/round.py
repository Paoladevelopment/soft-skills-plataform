from datetime import datetime
from uuid import UUID
from pydantic import field_serializer

from model.listening_core import RoundBase
from utils.payloads_listening_game import ROUND_READ_EXAMPLE
from utils.serializers import serialize_datetime_without_microseconds


class RoundRead(RoundBase):
    id: UUID
    game_id: UUID
    started_at: datetime | None = None
    deadline_at: datetime | None = None
    ended_at: datetime | None = None
    
    @field_serializer("started_at", "deadline_at", "ended_at", when_used="json")
    def serialize_datetime_fields(self, v: datetime | None) -> str | None:
        return serialize_datetime_without_microseconds(v)
    
    model_config = {
        "from_attributes": True,
        "json_schema_extra": {"example": ROUND_READ_EXAMPLE}
    }
