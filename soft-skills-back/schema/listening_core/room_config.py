from typing import Optional
from model.listening_core import RoomConfigBase
from utils.payloads_listening_game import ROOM_CREATE_EXAMPLE
from pydantic import field_validator
from sqlmodel import SQLModel
from enums.listening_game import PromptType, Difficulty, TeamAssignmentMode
from schema.listening_core.audio_effects import AudioEffects
from utils.listening_game_validators import (
    validate_rounds_total,
    validate_round_time_limit_sec,
    validate_listener_max_playbacks,
    validate_allowed_types_strict,
    validate_team_size,
    normalize_audio_effects_read,
    validate_rounds_total_optional,
    validate_round_time_limit_sec_optional,
    validate_listener_max_playbacks_optional,
    validate_allowed_types_strict_optional,
    validate_team_size_optional
)

class RoomConfigCreate(RoomConfigBase):
    audio_effects: AudioEffects | None = None

    model_config = {
        "json_schema_extra": {"example": ROOM_CREATE_EXAMPLE},
        "extra": "forbid",
        "from_attributes": True
    }

    @field_validator("rounds_total")
    @classmethod
    def _v_rounds_total(cls, v: int) -> int:
        return validate_rounds_total(v, min_v=1, max_v=8)

    @field_validator("round_time_limit_sec")
    @classmethod
    def _v_round_time_limit_sec(cls, v: int) -> int:
        return validate_round_time_limit_sec(v, min_v=60, max_v=300, multiple_of=5)

        
    @field_validator("listener_max_playbacks")
    @classmethod
    def _v_listener_max_playbacks(cls, v: int) -> int:
        return validate_listener_max_playbacks(v, min_v=1, max_v=3)

        
    @field_validator("allowed_types")
    @classmethod
    def _v_allowed_types(cls, v: list[PromptType]) -> list[PromptType]:
        return validate_allowed_types_strict(v)
    
    @field_validator("team_size")
    @classmethod
    def _v_team_size(cls, v: int) -> int:
        return validate_team_size(v)
    
class RoomConfigUpdate(SQLModel):
    rounds_total: Optional[int] = None
    round_time_limit_sec: Optional[int] = None
    listener_max_playbacks: Optional[int] = None
    allowed_types: Optional[list[PromptType]] = None
    difficulty: Optional[Difficulty] = None

    audio_effects: Optional[AudioEffects] = None

    team_assignment_mode: Optional[TeamAssignmentMode] = None
    team_size: Optional[int] = None
    
    model_config = {
        "extra": "forbid",
        "from_attributes": True
    }

    @field_validator("rounds_total")
    @classmethod
    def _v_rounds_total(cls, v: Optional[int]) -> Optional[int]:
        return validate_rounds_total_optional(v, min_v=1, max_v=8)
    
    @field_validator("round_time_limit_sec")
    @classmethod
    def _v_round_time_limit_sec(cls, v: Optional[int]) -> Optional[int]:
        return validate_round_time_limit_sec_optional(v, min_v=60, max_v=300, multiple_of=5)
    
    @field_validator("listener_max_playbacks")
    @classmethod
    def _v_listener_max_playbacks(cls, v: Optional[int]) -> Optional[int]:
        return validate_listener_max_playbacks_optional(v, min_v=1, max_v=3)
    
    @field_validator("allowed_types")
    @classmethod
    def _v_allowed_types(cls, v: Optional[list[PromptType]]) -> Optional[list[PromptType]]:
        return validate_allowed_types_strict_optional(v)
    
    @field_validator("team_size")
    @classmethod
    def _vu_team_size(cls, v: Optional[int]) -> Optional[int]:
        return validate_team_size_optional(v)

class RoomConfigRead(RoomConfigBase):
    audio_effects: AudioEffects | None = None

    model_config = {
        "from_attributes": True
    }

    @field_validator("audio_effects")
    @classmethod
    def _v_audio_effects(cls, v: AudioEffects | None) -> AudioEffects | None:
        return normalize_audio_effects_read(v)
