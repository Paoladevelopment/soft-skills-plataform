from datetime import datetime

from model.user import UserBase
from pydantic import UUID4, EmailStr, field_validator
from schema.base import BaseResponse
from sqlmodel import Field, SQLModel
from utils.payloads import (PASSWORD_UPDATE_EXAMPLE, USER_CREATE_EXAMPLE,
                            USER_READ_EXAMPLE, USER_UPDATE_EXAMPLE)
from utils.validators import validate_password, validate_username


class UserCreate(SQLModel):
    name: str = Field(description="Nombre del usuario.")
    username: str = Field(description="Nombre de usuario único (3–20 caracteres). Debe comenzar con una letra y contener solo letras, números o guiones bajos.")
    email: EmailStr = Field(description="Dirección de correo electrónico.")
    password: str = Field(min_length=8, description="Contraseña del usuario con al menos una letra y un número.")

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
    username: str | None = Field(default=None, description="Nombre de usuario actualizado del usuario.")
    name: str | None = Field(default=None, description="Nombre actualizado del usuario.")
    email: EmailStr | None = Field(default=None, description="Dirección de correo electrónico actualizada.")
    profile_picture: str | None = Field(default=None, description="URL de la imagen de perfil actualizada.")
    disabled: bool | None = Field(default=None, description="Establecer en false para desactivar el usuario.")

    model_config = {"json_schema_extra": {"example": USER_UPDATE_EXAMPLE}}

class PasswordUpdate(SQLModel):
    password: str = Field(..., min_length=8, description="Nueva contraseña para el usuario.")

    @field_validator("password")
    def validate_password(cls, value: str) -> str:
        return validate_password(value)
    model_config = {"json_schema_extra": {"example": PASSWORD_UPDATE_EXAMPLE}}


class UserResponse(BaseResponse[UserRead]):
    pass