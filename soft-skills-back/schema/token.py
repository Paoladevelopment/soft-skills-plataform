from uuid import UUID

from sqlmodel import Field, SQLModel

from enums.user import UserRoles

class TokenData(SQLModel):
  user_id: UUID | None = Field(default=None)
  role: UserRoles | None = Field(default=None)