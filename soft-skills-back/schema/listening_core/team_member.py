from datetime import datetime
from uuid import UUID
from pydantic import field_serializer

from model.listening_core import TeamMemberBase
from utils.serializers import serialize_datetime_without_microseconds


class TeamMemberRead(TeamMemberBase):
    team_id: UUID
    user_id: UUID
    
    @field_serializer("joined_at", when_used="json")
    def serialize_datetime_fields(self, v: datetime | None) -> str | None:
        return serialize_datetime_without_microseconds(v)
    
    model_config = {"from_attributes": True}
