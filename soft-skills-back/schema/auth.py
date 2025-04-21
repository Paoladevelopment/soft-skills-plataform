from schema.user import UserRead
from sqlmodel import SQLModel


class AuthResponse(SQLModel):
    access_token: str
    token_type: str
    user: UserRead