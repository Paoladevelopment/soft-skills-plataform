import logging
from datetime import datetime, timedelta, timezone
from typing import Optional
from uuid import UUID

from enums.user import UserRoles
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from model.user import User
from schema.token import TokenData
from service.user import UserService
from sqlmodel import Session
from utils.config import settings
from utils.errors import APIException
from utils.security import verify_password

logger = logging.getLogger(__name__)

SECRET_KEY = settings.SECRET_KEY
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(settings.TOKEN_EXPIRE or 15)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/v1/auth/login")

user_service = UserService()

def get_credentials_exception():
    return HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="No se pudieron validar las credenciales",
        headers={"WWW-Authenticate": "Bearer"},
    )


def authenticate_user(email: str, password: str, session: Session):
    try:
        user: User = user_service.get_user(email, session)
        if not user:
            return None
        if not verify_password(password, user.password):
            return None
        return user
    
    except APIException as api_error:
        raise api_error


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def generate_token(user: User):
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    return create_access_token(
        data={"sub": str(user.user_id), "role": user.role}, 
        expires_delta=access_token_expires
    )

def decode_jwt_token(token: str = Depends(oauth2_scheme)) -> TokenData:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        role: str = payload.get("role")

        if user_id is None or role is None:
            raise get_credentials_exception()

        return TokenData(user_id=UUID(user_id), role=UserRoles(role))

    except JWTError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Error al decodificar el token: {str(e)}"
        )

def get_current_admin_user(token: str = Depends(oauth2_scheme)) -> TokenData:
    token_data = decode_jwt_token(token)

    if token_data.role != UserRoles.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tiene permiso para acceder a este recurso"
        )

    return token_data