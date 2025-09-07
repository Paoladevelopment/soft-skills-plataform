import uuid
from datetime import datetime, timezone
from typing import List
from uuid import UUID

from sqlalchemy import Text
from sqlalchemy.dialects.postgresql import ARRAY, UUID as PG_UUID
from sqlmodel import TIMESTAMP, Field, Relationship, SQLModel


class LearningGoalBase(SQLModel):
  title: str
  description: str
  impact: str | None = Field(default=None)


class LearningGoal(LearningGoalBase, table=True):
  __tablename__ = "learning_goals"
  learning_goal_id: UUID = Field(default_factory=uuid.uuid4, primary_key=True)
  user_id: UUID | None = Field(default=None, foreign_key="users.user_id")
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
  objectives_order: List[UUID] = Field(
    default_factory=list,
    sa_type=ARRAY(PG_UUID(as_uuid=True))
  )
  started_at: datetime | None = Field(default=None)
  completed_at: datetime | None = Field(default=None)
  objectives: List["Objective"] = Relationship(
    back_populates="learning_goal", sa_relationship_kwargs={"lazy": "selectin", "cascade": "all, delete"}
  )