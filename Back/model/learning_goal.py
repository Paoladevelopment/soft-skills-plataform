import uuid
from sqlmodel import Field, SQLModel, TIMESTAMP
from sqlalchemy import Text
from datetime import datetime, timezone
from enums.learning_goal import LearningGoalPriority, LearningGoalStatus

class LearningGoalBase(SQLModel):
  title: str
  description: str
  status: LearningGoalStatus
  priority: LearningGoalPriority
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