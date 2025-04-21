
from datetime import datetime
from typing import List, TypeVar

from model.learning_goal import LearningGoalBase
from pydantic import UUID4
from schema.base import BaseResponse, PaginatedResponse
from schema.objective import ObjectiveSummary
from sqlmodel import Field, SQLModel
from utils.payloads import (LEARNING_GOAL_CREATE_EXAMPLE,
                            LEARNING_GOAL_DETAIL_READ_EXAMPLE,
                            LEARNING_GOAL_READ_EXAMPLE,
                            LEARNING_GOAL_WITH_PROGRESS_READ_EXAMPLE,
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
  model_config={"json_schema_extra": {"example": LEARNING_GOAL_READ_EXAMPLE}}

class LearningGoalReadWithProgress(LearningGoalReadBase):
  total_objectives: int
  completed_objectives: int
  model_config={"json_schema_extra": {"example": LEARNING_GOAL_WITH_PROGRESS_READ_EXAMPLE}}

class LearningGoalDetail(LearningGoalReadBase):
  objectives: List[ObjectiveSummary]

  model_config={"json_schema_extra": {"example": LEARNING_GOAL_DETAIL_READ_EXAMPLE}}

class LearningGoalUpdate(SQLModel):
  title: str | None = Field(default=None, description="Updated title of the learning goal")
  description: str | None = Field(default=None, description="Updated detailed explanation of the goal's purpose")
  impact: str | None = Field(default=None, description="Updated expected personal or professional benefit")

  model_config={
    "extra": "forbid",
    "json_schema_extra": 
      {"example": LEARNING_GOAL_UPDATE_EXAMPLE}
    }

class LearningGoalResponse(BaseResponse[T]):
  pass

LearningGoalPaginatedResponse = PaginatedResponse[LearningGoalReadWithProgress]