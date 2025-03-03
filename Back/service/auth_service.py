import logging
from datetime import datetime, timedelta, timezone
from typing import Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlmodel import Session, select
from utils.db import get_session
from jose import JWTError, jwt
from passlib.context import CryptContext
from model.user import User as UserModel
from schema.token import TokenData
from utils.config import settings
from enums.user import UserRoles

logger = logging.getLogger(__name__)

SECRET_KEY = settings.SECRET_KEY
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(settings.TOKEN_EXPIRE or 15)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/v1/login")

def get_credentials_exception():
    return HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )


def verify_password(plain_password: str, password: str):
    return pwd_context.verify(plain_password, password)


def get_password_hash(password: str):
    return pwd_context.hash(password)


def get_user(email: str, session: Session):
    try:
        return session.exec(select(UserModel).where(UserModel.email == email)).first()
    except Exception as e:
        session.rollback()
        logger.error(f"❌ Error fetching user {email}: {e}", exc_info=True)
        return None


def authenticate_user(email: str, password: str, session: Session):
    user: UserModel = get_user(email, session)
    if not user:
        return None
    if not verify_password(password, user.password):
        return None
    return user


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def generate_token(email: str, password: str, session: Session):
    user: UserModel = authenticate_user(email, password, session)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    return create_access_token(
        data={"sub": user.email, "role": user.role}, 
        expires_delta=access_token_expires
    )

def decode_jwt_token(token: str) -> TokenData:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        role: str = payload.get("role")

        if email is None or role is None:
            raise get_credentials_exception()

        return TokenData(email=email, role=UserRoles(role))

    except JWTError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Token decoding failed: {str(e)}"
        )


def get_current_user(token: str = Depends(oauth2_scheme), session: Session = Depends(get_session)):
    token_data = decode_jwt_token(token)

    user = get_user(token_data.email, session)
    if user is None:
        raise get_credentials_exception()
    return user

def get_current_admin_user(token: str = Depends(oauth2_scheme)) -> TokenData:
    token_data = decode_jwt_token(token)

    if token_data.role != UserRoles.admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to access this resource"
        )

    return token_data