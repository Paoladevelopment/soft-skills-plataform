from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from model.user import User
from schema.auth import AuthResponse
from schema.user import UserCreate, UserRead
from service.auth_service import authenticate_user, generate_token
from service.user import UserService
from sqlmodel import Session
from utils.db import get_session
from utils.errors import (APIException, Missing, raise_http_exception,
                          raise_unauthorized_exception)

router = APIRouter()

user_service = UserService()

@router.post(
    "/login",
    response_model=AuthResponse
)
def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(), 
    session: Session = Depends(get_session)
):
    """
    ### Login for access token

    #### Args:
    The app receives the following fields via form data:
    - **`username` (str)**: Your **email address** (OAuth2PasswordRequestForm uses `username`, but in this API, it represents the user's email).
    - **`password` (str)**: Your account password.

    #### Returns:
    - **`access_token` (str)**: A JWT token to authenticate future requests.
    - **`token_type` (str)**: `"bearer"` (OAuth2-compatible).
    """
    try:
        user: User = authenticate_user(form_data.username, form_data.password, session)
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password"
            )
        
        user_service.update_last_login_from_user(user, session)
        
        access_token = generate_token(user)
        return AuthResponse(
            access_token=access_token, 
            token_type="bearer", 
            user=UserRead.model_validate(user)
        )
    
    except APIException as err:
        if isinstance(err, Missing):
            raise_unauthorized_exception()
        
        raise_http_exception(err)

@router.post(
    "/register",
    status_code=status.HTTP_201_CREATED,
    summary="Creates a new user account",
)
def create_user(
    user: UserCreate, 
    session: Session = Depends(get_session)
):
    try:
        _ = user_service.create_user(user, session)

        return {
            "message": "User successfully created",
        }
    
    except APIException as exc:
        raise_http_exception(exc)      