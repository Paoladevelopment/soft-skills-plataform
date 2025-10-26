from enums.listening_game import PlayMode, Difficulty, AudioEffects
from typing import TypeAlias

ModeTimeLimits: TypeAlias = dict[PlayMode, int]
DifficultyTimeLimits: TypeAlias = dict[Difficulty, ModeTimeLimits]

EffectIntensity: TypeAlias = dict[AudioEffects, float]
DifficultyEffectsMap: TypeAlias = dict[Difficulty, EffectIntensity]

EASY_MODE_LIMITS: ModeTimeLimits = {
    PlayMode.focus: 40,
    PlayMode.cloze: 60,
    PlayMode.paraphrase: 75,
    PlayMode.summarize: 90,
    PlayMode.clarify: 55,
}

INTERMEDIATE_MODE_LIMITS: ModeTimeLimits = {
    PlayMode.focus: 30,
    PlayMode.cloze: 45,
    PlayMode.paraphrase: 60,
    PlayMode.summarize: 75,
    PlayMode.clarify: 40,
}

HARD_MODE_LIMITS: ModeTimeLimits = {
    PlayMode.focus: 20,
    PlayMode.cloze: 30,   
    PlayMode.paraphrase: 45,
    PlayMode.summarize: 60,
    PlayMode.clarify: 30,
}

DEFAULT_RESPONSE_TIME_LIMITS: DifficultyTimeLimits = {
    Difficulty.easy: EASY_MODE_LIMITS,
    Difficulty.intermediate: INTERMEDIATE_MODE_LIMITS,
    Difficulty.hard: HARD_MODE_LIMITS,
}

EASY_EFFECTS: EffectIntensity = {
    AudioEffects.reverb: 0.0,
    AudioEffects.echo: 0.0,
    AudioEffects.background_noise: 0.0,
    AudioEffects.speed_variation: 0.0,
}

INTERMEDIATE_EFFECTS = {
    AudioEffects.reverb: 0.3,
    AudioEffects.echo: 0.2,
    AudioEffects.background_noise: 0.2,
    AudioEffects.speed_variation: 0.1,
}

HARD_EFFECTS = {
    AudioEffects.reverb: 0.5,
    AudioEffects.echo: 0.3,
    AudioEffects.background_noise: 0.3,
    AudioEffects.speed_variation: 0.2,
}

DEFAULT_AUDIO_EFFECTS: DifficultyEffectsMap = {
    Difficulty.easy: EASY_EFFECTS,
    Difficulty.intermediate: INTERMEDIATE_EFFECTS,
    Difficulty.hard: HARD_EFFECTS,
}