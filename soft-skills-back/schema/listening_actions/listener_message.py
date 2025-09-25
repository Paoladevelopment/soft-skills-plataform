from datetime import datetime
from typing import List
from uuid import UUID
from pydantic import field_serializer
from sqlmodel import SQLModel

from model.listening_actions import ListenerMessageBase
from utils.payloads_listening_game import LISTENER_MESSAGE_CREATE_EXAMPLE
from utils.serializers import serialize_datetime_without_microseconds


class ListenerMessageCreate(SQLModel):
    content: str
    
    model_config = {"json_schema_extra": {"example": LISTENER_MESSAGE_CREATE_EXAMPLE}}


class ListenerMessageRead(ListenerMessageBase):
    id: UUID
    round_team_id: UUID
    author_user_id: UUID
    created_at: datetime
    
    @field_serializer("created_at", when_used="json")
    def serialize_datetime_fields(self, v: datetime | None) -> str | None:
        return serialize_datetime_without_microseconds(v)
    
    model_config = {"from_attributes": True}
