
from sqlmodel import Field, SQLModel
from pydantic import UUID4
from datetime import datetime
from enums.learning_goal import LearningGoalPriority
from model.learning_goal import LearningGoalBase
from schema.base import BaseResponse, PaginatedResponse
from utils.payloads import LEARNING_GOAL_CREATE_EXAMPLE, LEARNING_GOAL_READ_EXAMPLE, LEARNING_GOAL_UPDATE_EXAMPLE

class LearningGoalCreate(LearningGoalBase):
  model_config={"json_schema_extra": {"example": LEARNING_GOAL_CREATE_EXAMPLE}}

class LearningGoalRead(LearningGoalBase):
  learning_goal_id: UUID4
  started_at: datetime | None
  completed_at: datetime | None = Field(default=None)

  model_config={"json_schema_extra": {"example": LEARNING_GOAL_READ_EXAMPLE}}

class LearningGoalUpdate(SQLModel):
  title: str | None = Field(default=None, description="Updated title of the learning goal")
  description: str | None = Field(default=None, description="Updated detailed explanation of the goal's purpose")
  priority: LearningGoalPriority | None = Field(default=None, description="Updated priority level of the goal (low, medium, high)")
  estimated_completion_time: int | None = Field(default=None, description="Updated estimated number of days to complete the goal")
  impact: str | None = Field(default=None, description="Updated expected personal or professional benefit")

  model_config={"json_schema_extra": {"example": LEARNING_GOAL_UPDATE_EXAMPLE}}

class LearningGoalResponse(BaseResponse[LearningGoalRead]):
  data: LearningGoalRead

LearningGoalPaginatedResponse = PaginatedResponse[LearningGoalRead]