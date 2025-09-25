from datetime import datetime
from typing import Optional

from pydantic import field_serializer
from uuid import UUID
from sqlmodel import SQLModel

from utils.payloads_listening_game import EVENT_LOG_READ_EXAMPLE
from utils.serializers import serialize_datetime_without_microseconds


class EventLogRead(SQLModel):
    id: UUID
    game_id: UUID
    round_id: Optional[UUID] = None
    round_team_id: Optional[UUID] = None
    actor_user_id: Optional[UUID] = None
    type: str
    payload: dict
    occurred_at: datetime
    
    @field_serializer("occurred_at", when_used="json")
    def serialize_datetime_fields(self, v: datetime | None) -> str | None:
        return serialize_datetime_without_microseconds(v)
    
    model_config = {
        "from_attributes": True,
        "json_schema_extra": {"example": EVENT_LOG_READ_EXAMPLE}
    }
