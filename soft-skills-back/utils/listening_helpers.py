from typing import Dict
from enums.listening_game import PlayMode, Difficulty, AudioEffects
from utils.listening_defaults import (
    ModeTimeLimits,
    DEFAULT_RESPONSE_TIME_LIMITS,
    EASY_MODE_LIMITS,
    EffectIntensity,
    DEFAULT_AUDIO_EFFECTS,
    EASY_EFFECTS,
)

def serialize_response_time_limits(limits: ModeTimeLimits) -> Dict[str, int]:
    """Convert enum-keyed response time limits to string-keyed for JSON storage."""
    return {mode.value: time_limit_seconds for mode, time_limit_seconds in limits.items()}

def deserialize_response_time_limits(data: Dict[str, int]) -> ModeTimeLimits:
    """Convert string-keyed response time limits back to enum-keyed dictionary."""
    return {PlayMode(mode_key): time_limit_seconds for mode_key, time_limit_seconds in data.items()}

def resolve_response_time_limit(mode: PlayMode, difficulty: Difficulty) -> int:
    """Resolve the allowed response time (seconds) for a given play mode and difficulty level."""
    return DEFAULT_RESPONSE_TIME_LIMITS.get(difficulty, EASY_MODE_LIMITS).get(mode, 60)

def serialize_audio_effects(effects: EffectIntensity) -> Dict[str, float]:
    """Convert enum-keyed audio effects to string-keyed for JSON storage."""
    return {effect.value: float(intensity) for effect, intensity in effects.items()}

def deserialize_audio_effects(data: Dict[str, float]) -> EffectIntensity:
    """Convert string-keyed audio effects back to enum-keyed dictionary."""
    return {AudioEffects(effect_key): float(intensity) for effect_key, intensity in data.items()}

def resolve_audio_effects_for_difficulty(difficulty: Difficulty) -> EffectIntensity:
    """
        Return a JSON-ready map of audio effects for the given difficulty.
        Example: {"reverb": 0.3, "echo": 0.2, ...}
    """
    effects = DEFAULT_AUDIO_EFFECTS.get(difficulty, EASY_EFFECTS)
    return serialize_audio_effects(effects)