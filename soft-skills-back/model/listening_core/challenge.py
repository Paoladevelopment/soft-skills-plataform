from uuid import UUID, uuid4
from datetime import datetime, timezone
from typing import Optional, Dict, Any, List

from sqlalchemy import Text, Column, JSON, TIMESTAMP, Index
from sqlmodel import SQLModel, Field, Relationship

from enums.listening_game import PlayMode, PromptType, AudioStorage, Difficulty
from enums.common.language import Language


class ChallengeBase(SQLModel):
    play_mode: PlayMode
    prompt_type: PromptType
    difficulty: Difficulty

    audio_url: Optional[str] = Field(default=None)
    audio_storage: AudioStorage = Field(default=AudioStorage.supabase)

    audio_text: str
    language: Language = Field(default=Language.SPANISH)

    challenge_metadata: Dict[str, Any] = Field(default_factory=dict)


class Challenge(ChallengeBase, table=True):
    __tablename__ = "listening_challenge"

    challenge_id: UUID = Field(default_factory=uuid4, primary_key=True)

    audio_text: str = Field(sa_type=Text)
    summary: Optional[str] = Field(default=None, sa_type=Text)

    challenge_metadata: Dict[str, Any] = Field(
        default_factory=dict,
        sa_column=Column(JSON)
    )

    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc), 
        sa_type=TIMESTAMP(timezone=True)
    )

    rounds: List["GameRound"] = Relationship(back_populates="challenge")

