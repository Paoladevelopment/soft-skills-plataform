from datetime import datetime

from pydantic import UUID4
from sqlmodel import Field, SQLModel

from enums.common import Priority, Status
from enums.task import TaskType
from model.task import TaskBase
from schema.base import BaseResponse, PaginatedResponse
from utils.payloads import (TASK_CREATE_EXAMPLE, TASK_READ_EXAMPLE,
                            TASK_UPDATE_EXAMPLE)


class TaskCreate(TaskBase):
    model_config={"json_schema_extra": {"example": TASK_CREATE_EXAMPLE}}

class TaskRead(TaskBase):
    task_id: UUID4
    started_at: datetime | None
    completed_at: datetime | None

    model_config={"json_schema_extra": {"example": TASK_READ_EXAMPLE}}

class TaskSummary(SQLModel):
    task_id: UUID4
    title: str
    status: Status
    priority: Priority
    due_date: datetime | None
    order_index: int


class TaskUpdate(SQLModel):
    title: str | None = Field(default=None, description="Updated title of the task")
    description: str | None = Field(default=None, description="Updated detailed description of the task")
    task_type: TaskType | None = Field(
        default=None, 
        description="Updated type of task. Options: 'reading', 'practice', 'writing', 'research' (or others if defined)."
        )
    priority: Priority | None = Field(
        default=None, 
        description="Updated priority level of the task (low, medium, high)"
        )
    due_date: datetime | None = Field(default=None, description="Updated deadline for completing the task (ISO 8601 format: YYYY-MM-DDTHH:MM:SSZ)")
    is_optional: bool | None = Field(default=None, description="Indicates whether the task is optional")
    estimated_time: float | None = Field(default=None, description="Time that will take to complete the task")

    model_config={
        "json_schema_extra": {"example": TASK_UPDATE_EXAMPLE},
        "extra": "forbid"
    }

class TaskResponse(BaseResponse[TaskRead]):
    pass

TaskPaginatedResponse = PaginatedResponse[TaskRead]

