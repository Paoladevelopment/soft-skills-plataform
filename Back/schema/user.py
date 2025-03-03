from model.user import UserBase
from schema.base import BaseResponse
from utils.security import validate_password
from utils.payloads import USER_CREATE_EXAMPLE, USER_READ_EXAMPLE, USER_UPDATE_EXAMPLE, PASSWORD_UPDATE_EXAMPLE
from sqlmodel import Field, SQLModel
from pydantic import field_validator, EmailStr, UUID4
from datetime import datetime

class UserCreate(UserBase):
    password: str = Field(min_length=8, description="User's password with at least one letter and one number.")

    @field_validator("password")
    def check_password(cls, value: str) -> str:
        return validate_password(value)
    
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
    data: UserRead