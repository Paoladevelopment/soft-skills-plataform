from datetime import datetime
from typing import Optional, Dict, Any
from uuid import UUID

from pydantic import BaseModel, field_serializer, field_validator

from model.listening_core.game_round import GameRoundBase
from schema.listening_core.audio_effects import AudioEffects
from enums.listening_game import PlayMode, PromptType, GameRoundStatus
from utils.serializers import serialize_datetime_without_microseconds
from utils.listening_game_validators import normalize_audio_effects
from utils.payloads_listening_game import (
    CURRENT_ROUND_CONFIG_EXAMPLE,
    CURRENT_ROUND_RESPONSE_EXAMPLE
)


class GameRoundReadSummary(GameRoundBase):
    game_round_id: UUID

    model_config = {"from_attributes": True}


class GameRoundRead(GameRoundBase):
    game_round_id: UUID
    challenge_id: Optional[UUID] = None
    prepared_at: Optional[datetime] = None
    started_at: Optional[datetime] = None
    ended_at: Optional[datetime] = None

    @field_serializer("prepared_at", "started_at", "ended_at", when_used="json")
    def serialize_datetime_fields(self, v: datetime | None) -> str | None:
        return serialize_datetime_without_microseconds(v)

    model_config = {"from_attributes": True}


class CurrentRoundConfig(BaseModel):
    """Minimal config schema for current round response."""
    max_replays_per_round: int
    audio_effects: Optional[AudioEffects] = None

    model_config = {
        "from_attributes": True,
        "json_schema_extra": {"example": CURRENT_ROUND_CONFIG_EXAMPLE}
    }

    @field_validator("audio_effects")
    @classmethod
    def _validate_audio_effects(cls, v: AudioEffects | None) -> AudioEffects | None:
        return normalize_audio_effects(v)


class RoundEvaluationResponse(BaseModel):
    """Response schema for round evaluation when round is attempted."""
    round_submission_id: UUID
    is_correct: bool
    feedback_short: Optional[str] = None
    answer_payload: Dict[str, Any]
    correct_answer: Any  # Can be str, list[str], etc. depending on play_mode

    model_config = {"from_attributes": True}


class CurrentRoundResponse(BaseModel):
    """Response schema for current round endpoint."""
    round_id: UUID
    audio_url: Optional[str] = None
    config: CurrentRoundConfig
    current_round: int
    status: GameRoundStatus
    play_mode: Optional[PlayMode] = None
    prompt_type: Optional[PromptType] = None
    score: Optional[float] = None
    max_score: float
    mode_payload: Optional[Dict[str, Any]] = None
    evaluation: Optional[RoundEvaluationResponse] = None
    total_rounds: int
    name: str
    replays_used: int
    replays_left: int
    max_replays_per_round: int

    model_config = {
        "json_schema_extra": {"example": CURRENT_ROUND_RESPONSE_EXAMPLE}
    }


class RoundRecap(BaseModel):
    """Response schema for a round in the completion recap."""
    round_id: UUID
    round_number: int
    status: GameRoundStatus
    play_mode: Optional[PlayMode] = None
    prompt_type: Optional[PromptType] = None
    audio_url: Optional[str] = None
    score: Optional[float] = None
    max_score: float
    mode_payload: Optional[Dict[str, Any]] = None
    evaluation: Optional[RoundEvaluationResponse] = None
    replays_used: int
    replays_left: int
    max_replays_per_round: int

    model_config = {"from_attributes": True}
