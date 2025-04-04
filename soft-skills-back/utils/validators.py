import re

def validate_password(value: str) -> str:
    if not any(char.isdigit() for char in value):
        raise ValueError("Password must contain at least one number.")
    
    if not any(char.isalpha() for char in value):
        raise ValueError("Password must contain at least one letter.")
    
    return value


def validate_username(username: str) -> str:
    if not re.match(r"^[a-zA-Z][a-zA-Z0-9_]{2,19}$", username):
        raise ValueError(
            "Username must start with a letter and be 3–20 characters long. "
            "Only letters, numbers, and underscores are allowed."
        )
    return username