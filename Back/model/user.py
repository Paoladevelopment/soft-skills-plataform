import uuid
from sqlmodel import Field, SQLModel, TIMESTAMP
from pydantic import EmailStr
from datetime import datetime, timezone
from enums.user import UserRoles
class UserBase(SQLModel):
    name: str = Field(min_length=2, max_length=100)
    username: str
    email: EmailStr 
    profile_picture: str | None = Field(default=None)


class User(UserBase, table=True):
    user_id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    username: str = Field(unique=True, index=True)
    email: str = Field(unique=True, index=True)
    password: str = Field(min_length=8, description="Hashed password")
    role: UserRoles = Field(default=UserRoles.user)
    created_at: datetime | None = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_type=TIMESTAMP(timezone = True)
        )
    updated_at: datetime | None = Field(
      default_factory=lambda: datetime.now(timezone.utc),
      sa_column_kwargs={
          "onupdate": lambda: datetime.now(timezone.utc),
      },
      sa_type=TIMESTAMP(timezone=True),
    )
    last_login: datetime | None = Field(default=None, sa_type=TIMESTAMP(timezone=True))
    disabled: bool = Field(default=False)