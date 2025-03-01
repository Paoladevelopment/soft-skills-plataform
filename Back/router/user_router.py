from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm

from sqlmodel import Session

from utils.db import get_session
from utils.errors import Duplicate, InternalError

from model.user import User

from schema.user_schema import UserCreate, UserResponse, UserUpdate, UserRead
from schema.token_schema import Token

from service.user import (create_user, deactivate_user, update_user)
from service.auth_service import generate_token, get_current_user

from fastapi import APIRouter

router = APIRouter(
  prefix="/api/v1",
  tags=["users"]
)

@router.post(
    "/users",
    status_code=status.HTTP_201_CREATED,
    response_model=UserResponse,
    summary="Creates a new user account",
)
def create_an_user(user: UserCreate, db: Session = Depends(get_session)):
    try:
        new_user = create_user(user=user, db=db)
        return UserResponse(
            message="User successfully created",
            data=UserRead.model_validate(new_user)
        )
    except Duplicate as exc:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, 
            detail={
                "error": "User already exists", 
                "message": exc.msg
                }
        )
    except InternalError as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "error": "Internal Server Error",
                "message": exc.msg
            }
        )

@router.post(
    "/login",
    tags=["users"],
    response_model=Token
)
def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(), 
    db: Session = Depends(get_session)
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
    access_token = generate_token(form_data.username, form_data.password, db)
    return Token(access_token=access_token, token_type="bearer")


@router.patch(
    "/users/me", 
    summary="Updates user data by ID", 
    response_model=UserResponse
)
def update_an_user(
    user: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_session)
    ):
    try:
        updated_user = update_user(current_user.user_id, user, db)
        return UserResponse(
            message="User updated successfully",
            data=updated_user
        )
    except Duplicate as exc:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, 
            detail={
                "error":"Username already exists",
                "message": exc.msg
                }
            )
    except InternalError as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "error": "Internal Server Error",
                "message": exc.msg
            }
        )


@router.delete(
    "/users/me", 
    summary="Deletes the authenticated user"
    )
def delete_an_user(
    current_user: User = Depends(get_current_user), 
    db: Session = Depends(get_session)
    ):
    try:
        return deactivate_user(current_user.user_id, db)
    except InternalError as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "error": "Internal Server Error",
                "message": exc.msg
            }
        )
