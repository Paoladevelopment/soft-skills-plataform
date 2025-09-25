from datetime import datetime
from uuid import UUID
from pydantic import field_serializer
from sqlmodel import SQLModel

from model.listening_actions import DecoderAnswerBase
from utils.payloads_listening_game import DECODER_ANSWER_CREATE_EXAMPLE
from utils.serializers import serialize_datetime_without_microseconds


class DecoderAnswerCreate(SQLModel):
    selected_answer: str
    
    model_config = {"json_schema_extra": {"example": DECODER_ANSWER_CREATE_EXAMPLE}}


class DecoderAnswerRead(DecoderAnswerBase):
    id: UUID
    round_team_id: UUID
    team_id: UUID
    decoder_user_id: UUID
    submitted_at: datetime
    
    @field_serializer("submitted_at", when_used="json")
    def serialize_datetime_fields(self, v: datetime | None) -> str | None:
        return serialize_datetime_without_microseconds(v)
    
    model_config = {"from_attributes": True}
