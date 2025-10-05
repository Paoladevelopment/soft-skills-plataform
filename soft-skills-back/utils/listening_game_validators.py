from typing import List, Sequence, Optional
from enums.listening_game import PromptType
from schema.listening_core.audio_effects import AudioEffects

def validate_rounds_total(v: int, *, min_v: int = 1, max_v: int = 8) -> int:
    v = int(v)

    if not (min_v <= v <= max_v):
        raise ValueError(f"rounds_total must be between {min_v} and {max_v}")

    return v

def validate_round_time_limit_sec(v: int, *, min_v: int = 60, max_v: int = 300, multiple_of: int | None = None) -> int:
    v = int(v)

    if not (min_v <= v <= max_v):
        raise ValueError(f"round_time_limit_sec must be between {min_v} and {max_v}")

    if multiple_of and v % multiple_of != 0:
        raise ValueError(f"round_time_limit_sec must be a multiple of {multiple_of}")

    return v

def validate_listener_max_playbacks(v: int, *, min_v: int = 1, max_v: int = 3) -> int:
    v = int(v)

    if not (min_v <= v <= max_v):
        raise ValueError(f"listener_max_playbacks must be between {min_v} and {max_v}")

    return v

def validate_allowed_types_strict(seq: Sequence[PromptType]) -> List[PromptType]:
    if not seq:
        raise ValueError("allowed_types must contain at least one type")

    for item in seq:
        if not isinstance(item, PromptType):
            raise ValueError("allowed_types must contain only PromptType (descriptive, conversational, historical_event, instructional, dialogue, narrated_dialogue) values")

    if len(set(seq)) != len(seq):
        raise ValueError("allowed_types must not contain duplicates")

    return list(seq)

def validate_team_size(v: int, min_v: int = 2, max_v: int = 4) -> int:
    v = int(v)

    if not (min_v <= v <= max_v):
        raise ValueError(f"team_size must be between {min_v} and {max_v}")
    
    return v


def normalize_audio_effects_read(v):
    if v is None:
        return None

    if isinstance(v, AudioEffects):
        return v

    if isinstance(v, dict):
        return AudioEffects.model_validate(v)

    raise ValueError("audio_effects must be an object or null")

# ----- Optional wrappers -----
def validate_rounds_total_optional(
    v: Optional[int], *, min_v: int = 1, max_v: int = 8
) -> Optional[int]:
    if v is None:
        return None

    return validate_rounds_total(v, min_v=min_v, max_v=max_v)

def validate_round_time_limit_sec_optional(
    v: Optional[int], *, min_v: int = 60, max_v: int = 300, multiple_of: int | None = None
) -> Optional[int]:
    if v is None:
        return None

    return validate_round_time_limit_sec(v, min_v=min_v, max_v=max_v, multiple_of=multiple_of)

def validate_listener_max_playbacks_optional(
    v: Optional[int], *, min_v: int = 1, max_v: int = 3
) -> Optional[int]:
    if v is None:
        return None

    return validate_listener_max_playbacks(v, min_v=min_v, max_v=max_v)

def validate_allowed_types_strict_optional(
    seq: Optional[Sequence[PromptType]]
) -> Optional[list[PromptType]]:
    if seq is None:
        return None

    return validate_allowed_types_strict(seq)


def validate_team_size_optional(v: Optional[int], *, min_v: int = 2, max_v: int = 4) -> Optional[int]:
    if v is None:
        return None
    
    return validate_team_size(v, min_v=min_v, max_v=max_v)
