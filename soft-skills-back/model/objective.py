import uuid
from datetime import datetime, timezone
from typing import Dict, List, Optional
from uuid import UUID

from enums.common import Priority, Status
from sqlalchemy import Text
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.ext.mutable import MutableDict, MutableList
from sqlmodel import TIMESTAMP, Field, Relationship, SQLModel


def default_status_order():
    return {
        "not_started": MutableList(),
        "in_progress": MutableList(),
        "completed": MutableList(),
        "paused": MutableList(),
    }


class ObjectiveBase(SQLModel):
  title: str
  description: str
  status: Status = Field(default=Status.NOT_STARTED)
  priority: Priority
  due_date: datetime | None = Field(default=None)


class Objective(ObjectiveBase, table=True):
  __tablename__ = "objectives"
  objective_id: UUID = Field(default_factory=uuid.uuid4, primary_key=True)
  learning_goal_id: UUID | None = Field(default=None, foreign_key="learning_goals.learning_goal_id")
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
  tasks_order_by_status: Optional[dict] = Field(
    default_factory=default_status_order,
    sa_type=MutableDict.as_mutable(JSONB),
  )
  started_at: datetime | None = Field(default=None)
  completed_at: datetime | None = Field(default=None)
  learning_goal: Optional["LearningGoal"] = Relationship(back_populates="objectives")
  tasks: List["Task"] = Relationship(
    back_populates="objective", sa_relationship_kwargs={"lazy": "selectin", "cascade": "all, delete"}
  )