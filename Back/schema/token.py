from sqlmodel import Field, SQLModel
from enums.user import UserRoles

class Token(SQLModel):
  access_token: str
  token_type: str

class TokenData(SQLModel):
  email: str | None = Field(default=None)
  role: UserRoles | None = Field(default=None)