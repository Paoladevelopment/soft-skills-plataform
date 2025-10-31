from datetime import datetime
from typing import Optional, TypeVar

from pydantic import UUID4, field_serializer, BaseModel

from enums.listening_game import PlayMode, PromptType, Difficulty, AudioLength
from enums.common.language import Language
from model.listening_core.challenge import ChallengeBase
from schema.base import BaseResponse
from utils.serializers import serialize_datetime_without_microseconds
from utils.payloads_listening_game import (
    CHALLENGE_CREATE_EXAMPLE,
    CHALLENGE_READ_EXAMPLE,
    CHALLENGE_AUDIO_RESPONSE_EXAMPLE
)

T = TypeVar("T")


class GenerateChallenge(BaseModel):
    play_mode: PlayMode
    prompt_type: PromptType
    difficulty: Difficulty
    audio_length: AudioLength
    locale: Language
    """Schema for creating a new listening challenge."""
    model_config = {
        "extra": "forbid",
        "from_attributes": True,
        "json_schema_extra": {"example": CHALLENGE_CREATE_EXAMPLE}
    }


class ChallengeRead(BaseModel):
    """Schema for reading challenge data."""
    challenge_id: UUID4
    play_mode: PlayMode
    prompt_type: PromptType
    difficulty: Difficulty
    audio_url: Optional[str]
    audio_text: str
    created_at: datetime

    @field_serializer("created_at", when_used="json")
    def serialize_datetime_fields(self, v: datetime | None) -> str | None:
        return serialize_datetime_without_microseconds(v)

    model_config = {
        "from_attributes": True,
        "json_schema_extra": {"example": CHALLENGE_READ_EXAMPLE}
    }


class ChallengeResponse(BaseResponse[T]):
    """Generic response wrapper for challenge data."""
    pass


class ChallengeAudioResponse(BaseModel):
    """Response schema for challenge audio endpoint."""
    audio_url: str
    
    model_config = {
        "json_schema_extra": {"example": CHALLENGE_AUDIO_RESPONSE_EXAMPLE}
    }