from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session
from utils.db import get_session
from utils.errors import Duplicate, InternalError, raise_http_exception
from model.user import User
from schema.user import UserCreate, UserResponse, UserUpdate, UserRead
from service.user import (create_user, deactivate_user, update_user)
from service.auth_service import get_current_user

router = APIRouter()

@router.post(
    "",
    status_code=status.HTTP_201_CREATED,
    response_model=UserResponse,
    summary="Creates a new user account",
)
def create_an_user(user: UserCreate, db: Session = Depends(get_session)):
    try:
        new_user = create_user(user=user, db=db)
        user_data = UserRead.model_validate(new_user)

        return UserResponse(
            message="User successfully created",
            data=user_data
        )
    
    except Duplicate as exc:
        raise_http_exception(exc)
    
    except InternalError as exc:
        raise_http_exception(exc)

@router.patch(
    "/me", 
    summary="Updates user data by ID", 
    response_model=UserResponse
)
def update_an_user(
    user: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_session)
    ):
    try:
        updated_user = update_user(current_user, user, db)
        return UserResponse(
            message="User updated successfully",
            data=updated_user
        )
    
    except Duplicate as exc:
        raise_http_exception(exc)
    
    except InternalError as exc:
        raise_http_exception(exc)


@router.delete(
    "/me", 
    summary="Deletes the authenticated user"
    )
def delete_an_user(
    current_user: User = Depends(get_current_user), 
    db: Session = Depends(get_session)
    ):
    try:
        return deactivate_user(current_user, db)
    
    except InternalError as exc:
        raise_http_exception(exc)
