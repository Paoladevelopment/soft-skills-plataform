from uuid import UUID

from enums.user import UserRoles
from sqlmodel import Field, SQLModel


class TokenData(SQLModel):
  user_id: UUID | None = Field(default=None)
  role: UserRoles | None = Field(default=None)