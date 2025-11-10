from datetime import datetime
from pydantic import UUID4, field_serializer, field_validator
from typing import TypeVar 

from model.pomodoro_preferences import PomodoroPreferencesBase
from schema.base import BaseResponse
from sqlmodel import Field, SQLModel
from utils.payloads import (
    POMODORO_PREFERENCES_CREATE_EXAMPLE, 
    POMODORO_PREFERENCES_READ_EXAMPLE,
    POMODORO_CONFIGURATION_CONFIGURED_EXAMPLE
)
from utils.serializers import serialize_datetime_without_microseconds

T = TypeVar("T")


class PomodoroPreferencesRead(PomodoroPreferencesBase):
    pomodoro_preferences_id: UUID4
    created_at: datetime | None = Field(default=None)
    updated_at: datetime | None = Field(default=None)

    @field_serializer("created_at", "updated_at", when_used="json")
    def serialize_datetime_fields(self, v: datetime | None) -> str | None:
        return serialize_datetime_without_microseconds(v)

    model_config = {
        "json_schema_extra": {"example": POMODORO_PREFERENCES_READ_EXAMPLE},
        "from_attributes": True
    }

class PomodoroPreferencesResponse(BaseResponse[PomodoroPreferencesRead]):
    pass

class PomodoroConfiguration(SQLModel):
    """Response schema for pomodoro preferences configuration"""
    configured: bool = Field(description="Si el usuario ha configurado preferencias")
    effective_pomodoro_length_minutes: int = Field(description="Duración efectiva del pomodoro (configurada o predeterminada)")
    preferences: PomodoroPreferencesRead | None = Field(description="Preferencias del usuario si están configuradas, null en caso contrario")

    model_config = {
        "json_schema_extra": {"example": POMODORO_CONFIGURATION_CONFIGURED_EXAMPLE},
        "from_attributes": True
    }

class PomodoroPreferencesUpdate(PomodoroPreferencesBase):
    """Schema for updating pomodoro preferences"""
    @field_validator("pomodoro_length_minutes")
    @classmethod
    def v_len(cls, v: int) -> int:
        if not (10 <= v <= 120):
            raise ValueError("pomodoro_length_minutes debe estar entre 10 y 120")
        return v

    @field_validator("short_break_minutes")
    @classmethod
    def v_short(cls, v: int) -> int:
        if not (3 <= v <= 30):
            raise ValueError("short_break_minutes debe estar entre 3 y 30")
        return v

    @field_validator("long_break_minutes")
    @classmethod
    def v_long(cls, v: int) -> int:
        if not (10 <= v <= 60):
            raise ValueError("long_break_minutes debe estar entre 10 y 60")
        return v

    @field_validator("cycles_per_long_break")
    @classmethod
    def v_cycles(cls, v: int) -> int:
        if not (2 <= v <= 8):
            raise ValueError("cycles_per_long_break debe estar entre 2 y 8")
        return v

    model_config = {
        "json_schema_extra": {"example": POMODORO_PREFERENCES_CREATE_EXAMPLE},
        "from_attributes": True
    }