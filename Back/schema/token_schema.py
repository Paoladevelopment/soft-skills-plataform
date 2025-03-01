from sqlmodel import Field, SQLModel

class Token(SQLModel):
  access_token: str
  token_type: str

class TokenData(SQLModel):
  email: str | None = Field(default=None)