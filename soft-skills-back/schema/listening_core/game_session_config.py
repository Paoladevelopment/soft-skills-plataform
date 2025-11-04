from typing import Optional
from sqlmodel import SQLModel
from pydantic import field_validator

from model.listening_core.game_session_config import GameSessionConfigBase
from enums.listening_game import Difficulty, PromptType, PlayMode
from schema.listening_core.audio_effects import AudioEffects
from utils.listening_game_validators import (
    validate_total_rounds,
    validate_max_replays_per_round,
    validate_total_rounds_optional,
    validate_max_replays_per_round_optional,
    validate_allowed_types_strict_optional,
    validate_selected_modes_optional,
    normalize_audio_effects
)
from utils.payloads_listening_game import (
    GAME_SESSION_CONFIG_CREATE_EXAMPLE,
    GAME_SESSION_CONFIG_READ_EXAMPLE,
    GAME_SESSION_CONFIG_UPDATE_EXAMPLE
)


class GameSessionConfigCreate(GameSessionConfigBase):
    """Schema for creating a game session configuration."""
    response_time_limits: Optional[dict[str, int]] = None
    selected_modes: Optional[list[PlayMode]] = None
    allowed_types: Optional[list[PromptType]] = None
    audio_effects: Optional[AudioEffects] = None

    model_config = {
        "extra": "forbid",
        "from_attributes": True,
        "json_schema_extra": {"example": GAME_SESSION_CONFIG_CREATE_EXAMPLE}
    }

    @field_validator("total_rounds")
    @classmethod
    def _validate_total_rounds(cls, v: int) -> int:
        return validate_total_rounds(v)

    @field_validator("max_replays_per_round")
    @classmethod
    def _validate_max_replays(cls, v: int) -> int:
        return validate_max_replays_per_round(v)

    @field_validator("allowed_types")
    @classmethod
    def _validate_allowed_types(cls, v: Optional[list[PromptType]]) -> Optional[list[PromptType]]:
        return validate_allowed_types_strict_optional(v)

    @field_validator("selected_modes")
    @classmethod
    def _validate_selected_modes(cls, v: Optional[list[PlayMode]]) -> Optional[list[PlayMode]]:
        return validate_selected_modes_optional(v)


class GameSessionConfigUpdate(SQLModel):
    """Schema for updating a game session configuration (only before game starts)."""
    total_rounds: Optional[int] = None
    max_replays_per_round: Optional[int] = None
    difficulty: Optional[Difficulty] = None
    response_time_limits: Optional[dict[str, int]] = None
    selected_modes: Optional[list[PlayMode]] = None
    allowed_types: Optional[list[PromptType]] = None
    audio_effects: Optional[AudioEffects] = None
    reuse_existing_challenges: Optional[bool] = None

    model_config = {
        "extra": "forbid",
        "from_attributes": True,
        "json_schema_extra": {"example": GAME_SESSION_CONFIG_UPDATE_EXAMPLE}
    }

    @field_validator("total_rounds")
    @classmethod
    def _validate_total_rounds(cls, v: Optional[int]) -> Optional[int]:
        return validate_total_rounds_optional(v)

    @field_validator("max_replays_per_round")
    @classmethod
    def _validate_max_replays(cls, v: Optional[int]) -> Optional[int]:
        return validate_max_replays_per_round_optional(v)

    @field_validator("allowed_types")
    @classmethod
    def _validate_allowed_types(cls, v: Optional[list[PromptType]]) -> Optional[list[PromptType]]:
        return validate_allowed_types_strict_optional(v)

    @field_validator("selected_modes")
    @classmethod
    def _validate_selected_modes(cls, v: Optional[list[PlayMode]]) -> Optional[list[PlayMode]]:
        return validate_selected_modes_optional(v)


class GameSessionConfigRead(GameSessionConfigBase):
    """Schema for reading a game session configuration."""
    audio_effects: Optional[AudioEffects] = None

    model_config = {
        "from_attributes": True,
        "json_schema_extra": {"example": GAME_SESSION_CONFIG_READ_EXAMPLE}
    }

    @field_validator("audio_effects")
    @classmethod
    def _validate_audio_effects(cls, v: AudioEffects | None) -> AudioEffects | None:
        return normalize_audio_effects(v)

