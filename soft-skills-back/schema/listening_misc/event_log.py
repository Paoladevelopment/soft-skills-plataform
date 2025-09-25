from datetime import datetime
from uuid import UUID
from pydantic import field_serializer

from model.listening_misc import EventLogBase
from utils.payloads_listening_game import EVENT_LOG_READ_EXAMPLE
from utils.serializers import serialize_datetime_without_microseconds


class EventLogRead(EventLogBase):
    id: UUID
    game_id: UUID
    round_id: UUID | None = None
    round_team_id: UUID | None = None
    actor_user_id: UUID | None = None
    
    @field_serializer("occurred_at", when_used="json")
    def serialize_datetime_fields(self, v: datetime | None) -> str | None:
        return serialize_datetime_without_microseconds(v)
    
    model_config = {
        "from_attributes": True,
        "json_schema_extra": {"example": EVENT_LOG_READ_EXAMPLE}
    }
