from datetime import datetime

from pydantic import UUID4
from sqlmodel import Field, SQLModel

from enums.common import Priority, Status
from model.objective import ObjectiveBase
from schema.base import BaseResponse, PaginatedResponse
from utils.payloads import (OBJECTIVE_CREATE_EXAMPLE, OBJECTIVE_READ_EXAMPLE,
                            OBJECTIVE_UPDATE_EXAMPLE)


class ObjectiveCreate(ObjectiveBase):
  model_config={"json_schema_extra": {"example": OBJECTIVE_CREATE_EXAMPLE}}

class ObjectiveRead(ObjectiveBase):
  objective_id: UUID4
  started_at: datetime | None
  completed_at: datetime | None 

  model_config={"json_schema_extra": {"example": OBJECTIVE_READ_EXAMPLE}}

class ObjectiveSummary(SQLModel):
  objective_id: UUID4
  title: str
  status: Status
  priority: Priority
  due_date: datetime | None

class ObjectiveUpdate(SQLModel):
  title: str | None = Field(default=None, description="Updated title of the objective")
  description: str | None = Field(default=None, description="Updated detailed explanation of the objective’s purpose")
  priority: Priority | None = Field(default=None, description="Updated priority level of the objective (low, medium, high)")
  estimated_completion_time: int | None = Field(default=None, description="Updated estimated time in days to complete the objective")
  due_date: datetime | None = Field(default=None, description="Updated deadline for completing the objective (ISO 8601 format: YYYY-MM-DDTHH:MM:SSZ)")

  model_config={
    "json_schema_extra": {"example": OBJECTIVE_UPDATE_EXAMPLE},
    "extra": "forbid"
  }


class ObjectiveResponse(BaseResponse[ObjectiveRead]):
  pass

ObjectivePaginatedResponse = PaginatedResponse[ObjectiveRead]