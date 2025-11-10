from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, UUID4, field_serializer, field_validator

from model.self_evaluation import SelfEvaluationBase
from schema.base import BaseResponse
from utils.payloads import (
    SELF_EVALUATION_CREATE_EXAMPLE,
    SELF_EVALUATION_CREATED_EXAMPLE,
    SELF_EVALUATION_READ_EXAMPLE
)
from utils.serializers import serialize_datetime_without_microseconds


class SelfEvaluationCreate(SelfEvaluationBase):
    """Schema for creating a self-evaluation."""
    task_id: UUID
    
    @field_validator("concentration_level")
    @classmethod
    def validate_concentration_level(cls, v: int) -> int:
        if not (1 <= v <= 10):
            raise ValueError("concentration_level must be between 1 and 10")
        return v
    
    model_config = {
        "json_schema_extra": {"example": SELF_EVALUATION_CREATE_EXAMPLE}
    }


class SelfEvaluationCreated(BaseModel):
    """Summary schema for self-evaluation creation response."""
    evaluation_id: UUID4
    task_id: UUID4
    created_at: datetime
    
    @field_serializer("created_at", when_used="json")
    def serialize_datetime_fields(self, v: datetime) -> str:
        return serialize_datetime_without_microseconds(v)
    
    model_config = {
        "from_attributes": True,
        "json_schema_extra": {"example": SELF_EVALUATION_CREATED_EXAMPLE}
    }


class SelfEvaluationRead(SelfEvaluationBase):
    """Schema for reading a self-evaluation."""
    evaluation_id: UUID4
    task_id: UUID4
    user_id: UUID4
    created_at: datetime
    
    @field_serializer("created_at", when_used="json")
    def serialize_datetime_fields(self, v: datetime) -> str:
        return serialize_datetime_without_microseconds(v)
    
    model_config = {
        "from_attributes": True,
        "json_schema_extra": {"example": SELF_EVALUATION_READ_EXAMPLE}
    }


class SelfEvaluationCreatedResponse(BaseResponse[SelfEvaluationCreated]):
    """Response wrapper for self-evaluation creation."""
    pass


class SelfEvaluationResponse(BaseResponse[SelfEvaluationRead]):
    """Response wrapper for self-evaluation."""
    pass

