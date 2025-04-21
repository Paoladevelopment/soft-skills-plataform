import uuid
from datetime import datetime, timezone
from typing import List, Optional

from enums.common import Priority, Status
from pydantic import UUID4
from sqlalchemy import Text
from sqlmodel import TIMESTAMP, Field, Relationship, SQLModel


class ObjectiveBase(SQLModel):
  learning_goal_id: UUID4
  title: str
  description: str
  status: Status = Field(default=Status.NOT_STARTED)
  priority: Priority
  due_date: datetime | None = Field(default=None)
  order_index: int


class Objective(ObjectiveBase, table=True):
  __tablename__ = "objectives"
  objective_id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
  learning_goal_id: uuid.UUID | None = Field(default=None, foreign_key="learning_goals.learning_goal_id")
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
  learning_goal: Optional["LearningGoal"] = Relationship(back_populates="objectives")
  tasks: List["Task"] = Relationship(
    back_populates="objective", sa_relationship_kwargs={"lazy": "selectin", "cascade": "all, delete"}
  )