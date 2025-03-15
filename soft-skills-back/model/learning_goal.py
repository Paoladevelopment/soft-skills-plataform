import uuid
from datetime import datetime, timezone
from typing import List

from sqlalchemy import Text
from sqlmodel import TIMESTAMP, Field, Relationship, SQLModel

from enums.common import Priority, Status


class LearningGoalBase(SQLModel):
  title: str
  description: str
  status: Status
  priority: Priority
  estimated_completion_time: int
  impact: str | None = Field(default=None)


class LearningGoal(LearningGoalBase, table=True):
  __tablename__ = "learning_goals"
  learning_goal_id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
  user_id: uuid.UUID | None = Field(default=None, foreign_key="users.user_id")
  description: str = Field(sa_type=Text)
  created_at: datetime | None = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_type=TIMESTAMP(timezone = True)
        )
  updated_at: datetime | None = Field(
    default_factory=lambda: datetime.now(timezone.utc),
    sa_column_kwargs={
        "onupdate": lambda: datetime.now(timezone.utc),
    },
    sa_type=TIMESTAMP(timezone=True),
  )
  started_at: datetime | None = Field(default=None)
  completed_at: datetime | None = Field(default=None)
  objectives: List["Objective"] = Relationship(
    back_populates="learning_goal", sa_relationship_kwargs={"lazy": "selectin", "cascade": "all, delete"}
  )