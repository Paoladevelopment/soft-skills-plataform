from uuid import uuid4
from datetime import datetime, timezone
from uuid import UUID
from sqlmodel import SQLModel, Field, TIMESTAMP


class DecoderAnswerBase(SQLModel):
    selected_answer: str
    latency_ms: int | None = Field(default=None)


class DecoderAnswer(DecoderAnswerBase, table=True):
    __tablename__ = "listening_decoder_answer"
    
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    round_team_id: UUID = Field(
        foreign_key="listening_round_team.id",
        unique=True
    )
    team_id: UUID = Field(foreign_key="listening_team.id")
    decoder_user_id: UUID = Field(foreign_key="users.user_id")
    submitted_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_type=TIMESTAMP(timezone=True)
    )