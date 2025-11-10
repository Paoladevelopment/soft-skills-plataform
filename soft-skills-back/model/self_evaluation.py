from uuid import UUID, uuid4
from datetime import datetime, timezone
from typing import List, Optional

from sqlalchemy import JSON, Column, Text
from sqlmodel import TIMESTAMP, Field, Relationship, SQLModel

from enums.study_context import (
    StudyPlace,
    PerceivedDifficulty,
    Mood,
    TimeOfDay,
    NoiseLevel,
    CollaborationMode,
    LearningMethod
)


class SelfEvaluationBase(SQLModel):
    study_place: StudyPlace
    time_of_day: TimeOfDay
    noise_level: NoiseLevel
    collaboration_mode: CollaborationMode
    learning_intention: str = Field(sa_type=Text)
    what_went_well: str = Field(sa_type=Text)
    challenges_encountered: str = Field(sa_type=Text)
    improvement_plan: str = Field(sa_type=Text)
    perceived_difficulty: PerceivedDifficulty
    concentration_level: int = Field(ge=1, le=10)
    mood: Mood
    knowledge_connection: bool
    learning_methods: List[LearningMethod] = Field(default_factory=list, sa_column=Column(JSON))


class SelfEvaluation(SelfEvaluationBase, table=True):
    __tablename__ = "self_evaluations"
    
    evaluation_id: UUID = Field(default_factory=uuid4, primary_key=True)
    task_id: UUID = Field(index=True, foreign_key="tasks.task_id")
    user_id: UUID = Field(index=True, foreign_key="users.user_id")
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_type=TIMESTAMP(timezone=True)
    )
    
    task: Optional["Task"] = Relationship(back_populates="self_evaluations")

