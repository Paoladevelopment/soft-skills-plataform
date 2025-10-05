from uuid import UUID, uuid4
from datetime import datetime, timezone
from typing import Optional

from enums.common import Priority, Status
from enums.task import TaskType
from sqlalchemy import Text
from sqlmodel import TIMESTAMP, Field, Relationship, SQLModel


class TaskBase(SQLModel):
  objective_id: UUID
  title: str
  description: str
  task_type: TaskType
  status: Status = Field(default=Status.NOT_STARTED)
  priority: Priority

  estimated_seconds: int = Field(default=0)
  actual_seconds: int | None = Field(default=None)

  pomodoro_length_seconds_snapshot: int = Field(default=60*60, ge=60)

  due_date: datetime | None = Field(default=None)
  is_optional: bool = Field(default=False)

  @property
  def estimated_minutes(self) -> float:
    return self.estimated_seconds / 60
  
  @property
  def actual_minutes(self) -> float | None:
    return None if self.actual_seconds is None else self.actual_seconds / 60
  
  @property
  def estimated_pomodoros(self) -> float:
    if self.estimated_seconds <= 0:
      return 0
    if self.pomodoro_length_seconds_snapshot <= 0:
      return 0
      
    return self.estimated_seconds / self.pomodoro_length_seconds_snapshot
  
  @property
  def actual_pomodoros(self) -> float | None:
    if self.actual_seconds is None:
      return None
    if self.pomodoro_length_seconds_snapshot <= 0:
      return None

    return self.actual_seconds / self.pomodoro_length_seconds_snapshot


class Task(TaskBase, table=True):
  __tablename__ = "tasks"
  task_id: UUID = Field(default_factory=uuid4, primary_key=True)
  objective_id: UUID | None = Field(default=None, foreign_key="objectives.objective_id")
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