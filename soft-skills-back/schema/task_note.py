from datetime import datetime
from typing import List

from model.task_note import TaskNoteBase
from pydantic import UUID4, field_serializer
from schema.base import BaseResponse
from sqlmodel import Field, SQLModel
from utils.payloads import (TASK_NOTE_CREATE_EXAMPLE, TASK_NOTE_READ_EXAMPLE,
                             TASK_NOTE_UPDATE_EXAMPLE, TASK_NOTE_RESPONSE_EXAMPLE,
                             TASK_NOTE_LIST_RESPONSE_EXAMPLE)
from utils.serializers import serialize_datetime_without_microseconds


class TaskNoteCreate(SQLModel):
    title: str
    content: str
    model_config = {"json_schema_extra": {"example": TASK_NOTE_CREATE_EXAMPLE}}


class TaskNoteRead(TaskNoteBase):
    note_id: UUID4
    created_at: datetime | None = Field(default=None)
    updated_at: datetime | None = Field(default=None)

    @field_serializer("created_at", "updated_at", when_used="json")
    def serialize_datetime_fields(self, v: datetime | None) -> str | None:
        return serialize_datetime_without_microseconds(v)

    model_config = {
        "json_schema_extra": {"example": TASK_NOTE_READ_EXAMPLE},
        "from_attributes": True
    }


class TaskNoteUpdate(SQLModel):
    title: str | None = Field(default=None, description="Título actualizado de la nota")
    content: str | None = Field(default=None, description="Contenido detallado actualizado de la nota")

    model_config = {
        "json_schema_extra": {"example": TASK_NOTE_UPDATE_EXAMPLE},
        "extra": "forbid",
        "from_attributes": True
    }


class TaskNoteResponse(BaseResponse[TaskNoteRead]):
    model_config = {"json_schema_extra": {"example": TASK_NOTE_RESPONSE_EXAMPLE}}


class TaskNoteListResponse(BaseResponse[List[TaskNoteRead]]):
    model_config = {"json_schema_extra": {"example": TASK_NOTE_LIST_RESPONSE_EXAMPLE}}

