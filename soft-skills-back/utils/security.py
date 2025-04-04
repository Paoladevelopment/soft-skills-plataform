from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password: str, password: str):
    return pwd_context.verify(plain_password, password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)
