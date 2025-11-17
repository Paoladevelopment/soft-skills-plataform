from datetime import datetime
from typing import List

from enums.resource import ResourceType
from model.task_resource import TaskResourceBase
from pydantic import UUID4, field_serializer
from schema.base import BaseResponse
from sqlmodel import Field, SQLModel
from utils.payloads import (TASK_RESOURCE_CREATE_EXAMPLE, TASK_RESOURCE_READ_EXAMPLE,
                             TASK_RESOURCE_UPDATE_EXAMPLE, TASK_RESOURCE_RESPONSE_EXAMPLE,
                             TASK_RESOURCE_LIST_RESPONSE_EXAMPLE)
from utils.serializers import serialize_datetime_without_microseconds


class TaskResourceCreate(SQLModel):
    type: ResourceType
    title: str
    link: str
    model_config = {"json_schema_extra": {"example": TASK_RESOURCE_CREATE_EXAMPLE}}


class TaskResourceRead(TaskResourceBase):
    resource_id: UUID4
    created_at: datetime | None = Field(default=None)
    updated_at: datetime | None = Field(default=None)

    @field_serializer("created_at", "updated_at", when_used="json")
    def serialize_datetime_fields(self, v: datetime | None) -> str | None:
        return serialize_datetime_without_microseconds(v)

    model_config = {
        "json_schema_extra": {"example": TASK_RESOURCE_READ_EXAMPLE},
        "from_attributes": True
    }


class TaskResourceUpdate(SQLModel):
    type: ResourceType | None = Field(default=None, description="Tipo de recurso actualizado")
    title: str | None = Field(default=None, description="Título actualizado del recurso")
    link: str | None = Field(default=None, description="URL actualizada del recurso")

    model_config = {
        "json_schema_extra": {"example": TASK_RESOURCE_UPDATE_EXAMPLE},
        "extra": "forbid",
        "from_attributes": True
    }


class TaskResourceResponse(BaseResponse[TaskResourceRead]):
    model_config = {"json_schema_extra": {"example": TASK_RESOURCE_RESPONSE_EXAMPLE}}


class TaskResourceListResponse(BaseResponse[List[TaskResourceRead]]):
    model_config = {"json_schema_extra": {"example": TASK_RESOURCE_LIST_RESPONSE_EXAMPLE}}

