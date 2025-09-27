from uuid import uuid4
from datetime import datetime, timezone
from uuid import UUID
from sqlmodel import SQLModel, Field, TIMESTAMP

from enums.listening_game import AudioStorage


class AudioClipBase(SQLModel):
    voice_id: str | None = Field(default=None)
    model_id: str | None = Field(default=None)
    output_format: str | None = Field(default=None)
    storage: AudioStorage = Field(default=AudioStorage.none)
    url: str | None = Field(default=None)
    content_hash: str | None = Field(default=None)
    
    model_config = {"protected_namespaces": ()}


class AudioClip(AudioClipBase, table=True):
    __tablename__ = "listening_audio_clip"
    
    model_config = {"protected_namespaces": ()}
    
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    round_team_id: UUID = Field(
        foreign_key="listening_round_team.id",
        unique=True
    )
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_type=TIMESTAMP(timezone=True)
    )
    updated_at: datetime | None = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column_kwargs={
            "onupdate": lambda: datetime.now(timezone.utc),
        },
        sa_type=TIMESTAMP(timezone=True),
    )