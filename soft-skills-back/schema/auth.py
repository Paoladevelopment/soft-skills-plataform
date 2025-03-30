from sqlmodel import SQLModel
from schema.user import UserRead

class AuthResponse(SQLModel):
    access_token: str
    token_type: str
    user: UserRead