from datetime import datetime
from uuid import UUID

from enums.common import Priority, Status
from model.objective import ObjectiveBase
from pydantic import UUID4, field_serializer
from schema.base import BaseResponse, PaginatedResponse
from sqlmodel import Field, SQLModel
from utils.payloads import (OBJECTIVE_CREATE_EXAMPLE, OBJECTIVE_READ_EXAMPLE,
                            OBJECTIVE_WITH_PROGRESS_READ_EXAMPLE, OBJECTIVE_UPDATE_EXAMPLE)
from utils.serializers import serialize_datetime_without_microseconds


class ObjectiveCreate(ObjectiveBase):
    learning_goal_id: UUID
    model_config={"json_schema_extra": {"example": OBJECTIVE_CREATE_EXAMPLE}}

class ObjectiveRead(ObjectiveBase):
    objective_id: UUID4
    created_at: datetime | None = Field(default=None)
    updated_at: datetime | None = Field(default=None)
    started_at: datetime | None = Field(default=None)
    completed_at: datetime | None = Field(default=None)

    @field_serializer("started_at", "completed_at", "created_at", "updated_at", "due_date", when_used="json")
    def serialize_datetime_fields(self, v: datetime | None) -> str | None:
        return serialize_datetime_without_microseconds(v)

    model_config={
        "json_schema_extra": {"example": OBJECTIVE_READ_EXAMPLE},
        "from_attributes": True
    }

class ObjectiveReadWithProgress(ObjectiveRead):
    total_tasks: int
    completed_tasks: int

    model_config={"json_schema_extra": {"example": OBJECTIVE_WITH_PROGRESS_READ_EXAMPLE}}

class ObjectiveSummary(SQLModel):
    objective_id: UUID4
    title: str
    status: Status
    priority: Priority
    due_date: datetime | None

    @field_serializer("due_date", when_used="json")
    def serialize_due_date(self, v: datetime | None) -> str | None:
        return serialize_datetime_without_microseconds(v)

    model_config = {
        "from_attributes": True
    }

class ObjectiveUpdate(SQLModel):
    title: str | None = Field(default=None, description="Updated title of the objective")
    description: str | None = Field(default=None, description="Updated detailed explanation of the objective's purpose")
    priority: Priority | None = Field(default=None, description="Updated priority level of the objective (low, medium, high)")
    due_date: datetime | None = Field(default=None, description="Updated deadline for completing the objective (ISO 8601 format: YYYY-MM-DDTHH:MM:SSZ)")

    @field_serializer("due_date", when_used="json")
    def serialize_due_date(self, v: datetime | None) -> str | None:
        return serialize_datetime_without_microseconds(v)

    model_config={
      "json_schema_extra": {"example": OBJECTIVE_UPDATE_EXAMPLE},
      "extra": "forbid",
      "from_attributes": True
    }


class ObjectiveResponse(BaseResponse[ObjectiveRead]):
    pass

ObjectivePaginatedResponse = PaginatedResponse[ObjectiveReadWithProgress]