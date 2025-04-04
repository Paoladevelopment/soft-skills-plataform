from datetime import datetime

from pydantic import UUID4, EmailStr, field_validator
from sqlmodel import Field, SQLModel

from model.user import UserBase
from schema.base import BaseResponse
from utils.payloads import (PASSWORD_UPDATE_EXAMPLE, USER_CREATE_EXAMPLE,
                            USER_READ_EXAMPLE, USER_UPDATE_EXAMPLE)
from utils.validators import validate_password, validate_username


class UserCreate(SQLModel):
    name: str = Field(description="Name of the user.")
    username: str = Field(description="Unique username (3–20 characters). Must start with a letter and contain only letters, numbers, or underscores.")
    email: EmailStr = Field(description="Updated email address.")
    password: str = Field(min_length=8, description="User's password with at least one letter and one number.")

    @field_validator("password")
    def check_password(cls, value: str) -> str:
        return validate_password(value)
    
    @field_validator("username")
    def validate_username_field(cls, value: str) -> str:
        return validate_username(value)
    
    model_config = {"json_schema_extra": {"example": USER_CREATE_EXAMPLE}}


class UserRead(UserBase):
    user_id: UUID4
    last_login: datetime | None

    model_config = {"json_schema_extra": {"example": USER_READ_EXAMPLE}}


class UserUpdate(SQLModel):
    username: str | None = Field(default=None, description="Updated username of the user.")
    name: str | None = Field(default=None, description="Updated name of the user.")
    email: EmailStr | None = Field(default=None, description="Updated email address.")
    profile_picture: str | None = Field(default=None, description="URL of the updated profile picture.")
    disabled: bool | None = Field(default=None, description="Set to false to deactivate the user.")

    model_config = {"json_schema_extra": {"example": USER_UPDATE_EXAMPLE}}

class PasswordUpdate(SQLModel):
    password: str = Field(..., min_length=8, description="New password for the user.")

    @field_validator("password")
    def validate_password(cls, value: str) -> str:
        return validate_password(value)
    model_config = {"json_schema_extra": {"example": PASSWORD_UPDATE_EXAMPLE}}


class UserResponse(BaseResponse[UserRead]):
    pass