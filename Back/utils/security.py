def validate_password(value: str) -> str:
    if not any(char.isdigit() for char in value):
        raise ValueError("Password must contain at least one number.")
    
    if not any(char.isalpha() for char in value):
        raise ValueError("Password must contain at least one letter.")
    
    return value