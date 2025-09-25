from datetime import datetime
from uuid import UUID
from pydantic import field_serializer

from model.listening_actions import PenaltyBase
from utils.serializers import serialize_datetime_without_microseconds


class PenaltyRead(PenaltyBase):
    id: UUID
    round_team_id: UUID
    
    @field_serializer("created_at", when_used="json")
    def serialize_datetime_fields(self, v: datetime | None) -> str | None:
        return serialize_datetime_without_microseconds(v)
    
    model_config = {"from_attributes": True}
