from datetime import datetime
from typing import Optional, Dict, Any
from uuid import UUID

from pydantic import BaseModel, field_serializer

from model.listening_core.round_submission import RoundSubmissionBase
from enums.listening_game import PlayMode, PromptType
from utils.serializers import serialize_datetime_without_microseconds
from utils.payloads_listening_game import (
    ATTEMPT_SUBMISSION_PARAPHRASE_EXAMPLE,
    ATTEMPT_SUBMISSION_CLARIFY_EXAMPLE,
    ATTEMPT_SUBMISSION_SUMMARIZE_EXAMPLE,
    ATTEMPT_SUBMISSION_FOCUS_EXAMPLE,
    ATTEMPT_SUBMISSION_CLOZE_EXAMPLE,
    ATTEMPT_SUBMISSION_RESPONSE_EXAMPLE
)


class RoundSubmissionCreate(BaseModel):
    """Schema for creating a round submission."""
    game_round_id: UUID
    play_mode: PlayMode
    prompt_type: Optional[PromptType] = None
    answer_payload: Optional[Dict[str, Any]] = None
    client_elapsed_ms: Optional[int] = None
    idempotency_key: Optional[str] = None

    model_config = {
        "extra": "forbid",
        "from_attributes": True
    }


class RoundSubmissionRead(RoundSubmissionBase):
    """Schema for reading round submission data."""
    round_submission_id: UUID
    game_session_id: UUID
    game_round_id: UUID
    user_id: UUID
    submitted_at: datetime

    @field_serializer("submitted_at", when_used="json")
    def serialize_submitted_at(self, v: datetime) -> str:
        return serialize_datetime_without_microseconds(v)

    model_config = {
        "from_attributes": True
    }


class RoundSubmissionSummary(BaseModel):
    """Summary view of a round submission."""
    round_submission_id: UUID
    game_round_id: UUID
    play_mode: PlayMode
    prompt_type: Optional[PromptType] = None
    is_correct: bool
    feedback_short: Optional[str] = None
    submitted_at: datetime

    @field_serializer("submitted_at", when_used="json")
    def serialize_submitted_at(self, v: datetime) -> str:
        return serialize_datetime_without_microseconds(v)

    model_config = {
        "from_attributes": True
    }


class AttemptSubmissionRequest(BaseModel):
    """Request schema for submitting an attempt."""
    answer_payload: Dict[str, Any]
    idempotency_key: str
    client_elapsed_ms: Optional[int] = None

    model_config = {
        "extra": "forbid",
        "from_attributes": True,
        "json_schema_extra": {
            "examples": [
                ATTEMPT_SUBMISSION_PARAPHRASE_EXAMPLE,
                ATTEMPT_SUBMISSION_CLARIFY_EXAMPLE,
                ATTEMPT_SUBMISSION_SUMMARIZE_EXAMPLE,
                ATTEMPT_SUBMISSION_FOCUS_EXAMPLE,
                ATTEMPT_SUBMISSION_CLOZE_EXAMPLE
            ]
        }
    }


class AttemptSubmissionResponse(BaseModel):
    """Response schema for attempt submission."""
    round_number: int
    is_correct: bool
    score: float
    feedback_short: str
    client_elapsed_ms: Optional[int] = None
    can_advance: bool = True

    model_config = {
        "from_attributes": True,
        "json_schema_extra": {"example": ATTEMPT_SUBMISSION_RESPONSE_EXAMPLE}
    }
