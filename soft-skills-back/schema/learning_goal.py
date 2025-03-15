
from datetime import datetime
from typing import List, TypeVar

from pydantic import UUID4
from sqlmodel import Field, SQLModel

from enums.common import Priority
from model.learning_goal import LearningGoalBase
from schema.base import BaseResponse, PaginatedResponse
from schema.objective import ObjectiveSummary
from utils.payloads import (LEARNING_GOAL_CREATE_EXAMPLE,
                            LEARNING_GOAL_READ_EXAMPLE,
                            LEARNING_GOAL_UPDATE_EXAMPLE)

T = TypeVar("T")
class LearningGoalCreate(LearningGoalBase):
  model_config={"json_schema_extra": {"example": LEARNING_GOAL_CREATE_EXAMPLE}}

class LearningGoalReadBase(LearningGoalBase):
  learning_goal_id: UUID4
  user_id: UUID4
  started_at: datetime | None
  completed_at: datetime | None = Field(default=None)
class LearningGoalRead(LearningGoalReadBase):
  pass

class LearningGoalDetail(LearningGoalReadBase):
  objectives: List[ObjectiveSummary]

  model_config={"json_schema_extra": {"example": LEARNING_GOAL_READ_EXAMPLE}}

class LearningGoalUpdate(SQLModel):
  title: str | None = Field(default=None, description="Updated title of the learning goal")
  description: str | None = Field(default=None, description="Updated detailed explanation of the goal's purpose")
  priority: Priority | None = Field(default=None, description="Updated priority level of the goal (low, medium, high)")
  estimated_completion_time: int | None = Field(default=None, description="Updated estimated number of days to complete the goal")
  impact: str | None = Field(default=None, description="Updated expected personal or professional benefit")

  model_config={"json_schema_extra": {"example": LEARNING_GOAL_UPDATE_EXAMPLE}}

class LearningGoalResponse(BaseResponse[T]):
  pass

LearningGoalPaginatedResponse = PaginatedResponse[LearningGoalRead]