from uuid import UUID
from sqlmodel import SQLModel, Field, Column, JSON, Relationship

from enums.listening_game import Difficulty, PromptType, PlayMode
from utils.listening_defaults import DEFAULT_RESPONSE_TIME_LIMITS, DEFAULT_AUDIO_EFFECTS
from utils.listening_helpers import serialize_response_time_limits, serialize_audio_effects

ALL_PLAY_MODES: list[PlayMode] = [
    PlayMode.focus, 
    PlayMode.cloze, 
    PlayMode.paraphrase, 
    PlayMode.summarize, 
    PlayMode.clarify
]

ALL_PROMPT_TYPES: list[PromptType] = [
    PromptType.descriptive, 
    PromptType.conversational, 
    PromptType.historical_event, 
    PromptType.narrated_dialogue, 
    PromptType.dialogue, 
    PromptType.instructional
]

class GameSessionConfigBase(SQLModel):
    """Configuration for a single-player listening game session."""
    total_rounds: int = Field(default=5)
    max_replays_per_round: int = Field(default=2)

    difficulty: Difficulty = Field(default=Difficulty.easy)

    response_time_limits: dict[str, int] = Field(
        default_factory=lambda: serialize_response_time_limits(
            DEFAULT_RESPONSE_TIME_LIMITS.get(Difficulty.easy)
        ),
    )

    selected_modes: list[PlayMode] = Field(
        default_factory=lambda: ALL_PLAY_MODES.copy()
    )

    allowed_types: list[PromptType] = Field(
        default_factory=lambda: ALL_PROMPT_TYPES.copy()
    )

    audio_effects: dict[str, float] = Field(
        default_factory=lambda: serialize_audio_effects(
            DEFAULT_AUDIO_EFFECTS.get(Difficulty.easy)
        )
    )


class GameSessionConfig(GameSessionConfigBase, table=True):
    __tablename__ = "listening_game_session_config"
    
    game_session_id: UUID = Field(
        primary_key=True, 
        foreign_key="listening_game_session.id"
    )

    game_session: "GameSession" = Relationship(
        back_populates="config"
    )

    response_time_limits: dict[str, int] = Field(
        default_factory=lambda: serialize_response_time_limits(
            DEFAULT_RESPONSE_TIME_LIMITS.get(Difficulty.easy)
        ),
        sa_column=Column(JSON)
    )

    selected_modes: list[PlayMode] = Field(
        default_factory=lambda: ALL_PLAY_MODES.copy(),
        sa_column=Column(JSON)
    )

    allowed_types: list[PromptType] = Field(
        default_factory=lambda: ALL_PROMPT_TYPES.copy(),
        sa_column=Column(JSON)
    )

    audio_effects: dict[str, float] = Field(
        default_factory=lambda: serialize_audio_effects(
            DEFAULT_AUDIO_EFFECTS.get(Difficulty.easy)
        ),
        sa_column=Column(JSON)
    )