from datetime import datetime
from uuid import UUID
from pydantic import field_serializer
from sqlmodel import SQLModel

from utils.serializers import serialize_datetime_without_microseconds


class TeamMemberRead(SQLModel):
    joined_at: datetime
    team_id: UUID
    user_id: UUID
    
    @field_serializer("joined_at", when_used="json")
    def serialize_datetime_fields(self, v: datetime | None) -> str | None:
        return serialize_datetime_without_microseconds(v)
    
    model_config = {"from_attributes": True}
