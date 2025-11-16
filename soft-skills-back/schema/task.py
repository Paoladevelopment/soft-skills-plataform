from datetime import datetime
from uuid import UUID

from enums.common import Priority, Status
from enums.task import TaskType
from model.task import TaskBase
from pydantic import UUID4, field_serializer, computed_field
from schema.base import BaseResponse, PaginatedResponse
from sqlmodel import Field, SQLModel
from utils.payloads import (TASK_CREATE_EXAMPLE, TASK_READ_EXAMPLE,
                            TASK_UPDATE_EXAMPLE)
from utils.serializers import serialize_datetime_without_microseconds


class TaskCreate(TaskBase):
    objective_id: UUID
    model_config={"json_schema_extra": {"example": TASK_CREATE_EXAMPLE}}

class TaskRead(TaskBase):
    task_id: UUID4
    created_at: datetime | None = Field(default=None)
    updated_at: datetime | None = Field(default=None)
    started_at: datetime | None = Field(default=None)
    completed_at: datetime | None = Field(default=None)

    @field_serializer("started_at", "completed_at", "created_at", "updated_at", "due_date", when_used="json")
    def serialize_datetime_fields(self, v: datetime | None) -> str | None:
        return serialize_datetime_without_microseconds(v)
    
    @computed_field
    def estimated_minutes(self) -> float:
        return super().estimated_minutes
    
    @computed_field
    def actual_minutes(self) -> float | None:
        return super().actual_minutes
    
    @computed_field
    def estimated_pomodoros(self) -> float:
        return super().estimated_pomodoros
    
    @computed_field
    def actual_pomodoros(self) -> float | None:
        return super().actual_pomodoros

    model_config={
        "json_schema_extra": {"example": TASK_READ_EXAMPLE},
        "from_attributes": True
    }

class TaskSummary(SQLModel):
    task_id: UUID4
    title: str
    description: str
    task_type: TaskType
    status: Status
    priority: Priority
    due_date: datetime | None
    is_optional: bool

    @field_serializer("due_date", when_used="json")
    def serialize_due_date(self, v: datetime | None) -> str | None:
        return serialize_datetime_without_microseconds(v)

    model_config = {
        "from_attributes": True
    }


class TaskUpdate(SQLModel):
    title: str | None = Field(default=None, description="Título actualizado de la tarea")
    description: str | None = Field(default=None, description="Descripción detallada actualizada de la tarea")
    task_type: TaskType | None = Field(
        default=None, 
        description="Tipo actualizado de tarea. Opciones: 'reading', 'practice', 'writing', 'research' (u otros si están definidos)."
        )
    priority: Priority | None = Field(
        default=None, 
        description="Nivel de prioridad actualizado de la tarea (low, medium, high)"
        )
    due_date: datetime | None = Field(default=None, description="Fecha límite actualizada para completar la tarea (formato ISO 8601: YYYY-MM-DDTHH:MM:SSZ)")
    is_optional: bool | None = Field(default=None, description="Indica si la tarea es opcional")
    
    estimated_seconds: int | None = Field(default=None, description="Tiempo que tomará completar la tarea en segundos", ge=0)

    @field_serializer("due_date", when_used="json")
    def serialize_due_date(self, v: datetime | None) -> str | None:
        return serialize_datetime_without_microseconds(v)

    model_config={
        "json_schema_extra": {"example": TASK_UPDATE_EXAMPLE},
        "extra": "forbid",
        "from_attributes": True
    }

class TaskResponse(BaseResponse[TaskRead]):
    pass

TaskPaginatedResponse = PaginatedResponse[TaskRead]

