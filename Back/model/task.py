import uuid
from datetime import datetime, timezone
from typing import Optional

from pydantic import UUID4
from sqlalchemy import Text
from sqlmodel import TIMESTAMP, Field, Relationship, SQLModel

from enums.common import Priority, Status
from enums.task import TaskType


class TaskBase(SQLModel):
  objective_id: UUID4
  title: str
  description: str
  task_type: TaskType
  status: Status = Field(default=Status.NOT_STARTED)
  priority: Priority
  estimated_time: float
  actual_time: float | None = Field(default=None)
  due_date: datetime | None = Field(default=None)
  order_index: int = Field(default=1)
  is_optional: bool = Field(default=False)


class Task(TaskBase, table=True):
  __tablename__ = "tasks"
  task_id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
  objective_id: uuid.UUID | None = Field(default=None, foreign_key="objectives.objective_id")
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
  objective: Optional["Objective"] = Relationship(back_populates="tasks")