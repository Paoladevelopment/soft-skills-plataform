from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password: str, password: str):
    return pwd_context.verify(plain_password, password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def validate_password(value: str) -> str:
    if not any(char.isdigit() for char in value):
        raise ValueError("Password must contain at least one number.")
    
    if not any(char.isalpha() for char in value):
        raise ValueError("Password must contain at least one letter.")
    
    return value