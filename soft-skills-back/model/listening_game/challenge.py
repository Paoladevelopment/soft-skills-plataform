from uuid import uuid4
from uuid import UUID
from sqlmodel import SQLModel, Field, Column, JSON


class ChallengeBase(SQLModel):
    audio_text: str
    forbidden_words: list[str] = Field(default_factory=list)
    answer_choices: list[str] = Field(default_factory=list)
    correct_answer_server_only: str


class Challenge(ChallengeBase, table=True):
    __tablename__ = "listening_challenge"
    
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    round_team_id: UUID = Field(
        foreign_key="listening_round_team.id",
        unique=True
    )
    forbidden_words: list[str] = Field(
        default_factory=list,
        sa_column=Column(JSON)
    )
    answer_choices: list[str] = Field(
        default_factory=list,
        sa_column=Column(JSON)
    )