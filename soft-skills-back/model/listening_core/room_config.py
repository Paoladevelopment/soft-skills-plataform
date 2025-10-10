from uuid import UUID
from sqlmodel import SQLModel, Field, Column, JSON

from enums.listening_game import Difficulty, PromptType, TeamAssignmentMode
from utils.listening_game_constants import DEFAULT_TEAM_SIZE, DEFAULT_TEAMS_COUNT

class RoomConfigBase(SQLModel):
    rounds_total: int = Field(default=5)
    round_time_limit_sec: int = Field(default=90)
    listener_max_playbacks: int = Field(default=2)
    allowed_types: list[PromptType] = Field(
        default_factory=lambda: [PromptType.descriptive, PromptType.conversational, PromptType.historical_event, PromptType.narrated_dialogue, PromptType.dialogue, PromptType.instructional]
    )
    difficulty: Difficulty = Field(default=Difficulty.easy)
    audio_effects: dict = Field(default_factory=dict)
    team_assignment_mode: TeamAssignmentMode = Field(default=TeamAssignmentMode.manual)
    team_size: int = Field(default=DEFAULT_TEAM_SIZE)


class RoomConfig(RoomConfigBase, table=True):
    __tablename__ = "listening_room_config"
    
    room_id: UUID = Field(
        primary_key=True, 
        foreign_key="listening_room.id"
    )
    allowed_types: list[PromptType] = Field(
        default_factory=lambda: [PromptType.descriptive, PromptType.conversational, PromptType.historical_event, PromptType.narrated_dialogue, PromptType.dialogue, PromptType.instructional],
        sa_column=Column(JSON)
    )
    audio_effects: dict = Field(
        default_factory=dict,
        sa_column=Column(JSON)
    )
    teams_count: int = Field(default=DEFAULT_TEAMS_COUNT)
