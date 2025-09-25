from typing import List
from uuid import UUID
from sqlmodel import SQLModel

from model.listening_game import ChallengeBase


class ChallengePublicRead(SQLModel):
    """Public challenge data - excludes correct_answer_server_only"""
    id: UUID
    round_team_id: UUID
    audio_text: str
    forbidden_words: List[str]
    answer_choices: List[str]
    
    model_config = {"from_attributes": True}


class ChallengeInternalRead(ChallengeBase):
    """Internal challenge data - includes correct_answer_server_only (server-side only)"""
    id: UUID
    round_team_id: UUID
    
    model_config = {"from_attributes": True}
