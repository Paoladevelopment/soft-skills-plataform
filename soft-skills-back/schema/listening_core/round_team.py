from typing import List, Optional
from uuid import UUID
from sqlmodel import SQLModel

from utils.payloads_listening_game import (
    ROUND_TEAM_LISTENER_VIEW_EXAMPLE,
    ROUND_TEAM_DECODER_VIEW_EXAMPLE
)


class RoundTeamListenerView(SQLModel):
    round_team_id: UUID
    forbidden_words: List[str]
    remaining_playbacks: int
    audio: Optional["AudioClipRead"] = None
    
    model_config = {"json_schema_extra": {"example": ROUND_TEAM_LISTENER_VIEW_EXAMPLE}}


class RoundTeamDecoderView(SQLModel):
    round_team_id: UUID
    listener_messages: List["ListenerMessageRead"]
    answer_choices: List[str]
    time_left_sec: int
    voice_room_url: Optional[str] = None
    
    model_config = {"json_schema_extra": {"example": ROUND_TEAM_DECODER_VIEW_EXAMPLE}}
