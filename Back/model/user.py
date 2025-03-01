import uuid

from sqlmodel import Field, SQLModel, TIMESTAMP
from pydantic import EmailStr, UUID4
from datetime import datetime, timezone
class UserBase(SQLModel):
    name: str = Field(min_length=2, max_length=100)
    username: str = Field(unique=True, index=True)
    email: EmailStr = Field(unique=True, index=True)
    profile_picture: str | None = Field(default=None)


class User(UserBase, table=True):
    user_id: UUID4 = Field(default_factory=uuid.uuid4, primary_key=True)
    password: str = Field(min_length=8, description="Hashed password")
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