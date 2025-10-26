from typing import List, Sequence, Optional
from enums.listening_game import PromptType, PlayMode
from schema.listening_core.audio_effects import AudioEffects


def validate_total_rounds(v: int, *, min_v: int = 1, max_v: int = 10) -> int:
    """Validate total rounds for a game session."""
    v = int(v)
    
    if not (min_v <= v <= max_v):
        raise ValueError(f"total_rounds must be between {min_v} and {max_v}")
    
    return v


def validate_max_replays_per_round(v: int, *, min_v: int = 0, max_v: int = 5) -> int:
    """Validate max replays per round for a game session."""
    v = int(v)
    
    if not (min_v <= v <= max_v):
        raise ValueError(f"max_replays_per_round must be between {min_v} and {max_v}")
    
    return v


def validate_allowed_types_strict(seq: Sequence[PromptType]) -> List[PromptType]:
    """Validate allowed prompt types - must have at least one, no duplicates."""
    if not seq:
        raise ValueError("allowed_types must contain at least one type")
    
    for item in seq:
        if not isinstance(item, PromptType):
            raise ValueError(
                "allowed_types must contain only PromptType "
                "(descriptive, conversational, historical_event, instructional, dialogue, narrated_dialogue) values"
            )
    
    if len(set(seq)) != len(seq):
        raise ValueError("allowed_types must not contain duplicates")
    
    return list(seq)


def validate_selected_modes(seq: Sequence[PlayMode]) -> List[PlayMode]:
    """Validate selected play modes - must have at least one, no duplicates."""
    if not seq:
        raise ValueError("selected_modes must contain at least one play mode")
    
    for item in seq:
        if not isinstance(item, PlayMode):
            raise ValueError(
                "selected_modes must contain only PlayMode "
                "(focus, cloze, paraphrase, summarize, clarify) values"
            )
    
    if len(set(seq)) != len(seq):
        raise ValueError("selected_modes must not contain duplicates")
    
    return list(seq)


def normalize_audio_effects(v):
    """Normalize audio effects to AudioEffects object or None."""
    if v is None:
        return None
    
    if isinstance(v, AudioEffects):
        return v
    
    if isinstance(v, dict):
        return AudioEffects.model_validate(v)
    
    raise ValueError("audio_effects must be an object or null")


# ===== Optional Wrappers =====

def validate_total_rounds_optional(
    v: Optional[int], *, min_v: int = 1, max_v: int = 10
) -> Optional[int]:
    """Validate total rounds (optional)."""
    if v is None:
        return None
        
    return validate_total_rounds(v, min_v=min_v, max_v=max_v)


def validate_max_replays_per_round_optional(
    v: Optional[int], *, min_v: int = 0, max_v: int = 5
) -> Optional[int]:
    """Validate max replays per round (optional)."""
    if v is None:
        return None

    return validate_max_replays_per_round(v, min_v=min_v, max_v=max_v)


def validate_allowed_types_strict_optional(
    seq: Optional[Sequence[PromptType]]
) -> Optional[List[PromptType]]:
    """Validate allowed types (optional)."""
    if seq is None:
        return None

    return validate_allowed_types_strict(seq)


def validate_selected_modes_optional(
    seq: Optional[Sequence[PlayMode]]
) -> Optional[List[PlayMode]]:
    """Validate selected modes (optional)."""
    if seq is None:
        return None

    return validate_selected_modes(seq)
