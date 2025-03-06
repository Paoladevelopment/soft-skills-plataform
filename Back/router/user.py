from fastapi import APIRouter, Depends, status
from sqlmodel import Session
from utils.db import get_session
from utils.errors import APIException, raise_http_exception
from model.user import User
from schema.user import UserCreate, UserResponse, UserUpdate, UserRead
from service.user import UserService
from service.auth_service import get_current_user

router = APIRouter()
user_service = UserService()

@router.post(
    "",
    status_code=status.HTTP_201_CREATED,
    response_model=UserResponse,
    summary="Creates a new user account",
)
def create_user(user: UserCreate, session: Session = Depends(get_session)):
    try:
        new_user = user_service.create_user(user, session)
        user_data = UserRead.model_validate(new_user)

        return UserResponse(
            message="User successfully created",
            data=user_data
        )
    
    except APIException as exc:
        raise_http_exception(exc)

@router.patch(
    "/me", 
    summary="Updates user data by ID", 
    response_model=UserResponse
)
def update_an_user(
    user: UserUpdate,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
    ):
    try:
        updated_user = user_service.update_user(current_user, user, session)
        return UserResponse(
            message="User updated successfully",
            data=updated_user
        )
    
    except APIException as exc:
        raise_http_exception(exc)


@router.delete(
    "/me", 
    summary="Deletes the authenticated user"
    )
def delete_an_user(
    current_user: User = Depends(get_current_user), 
    session: Session = Depends(get_session)
    ):
    try:
        return user_service.deactivate_user(current_user, session)
    
    except APIException as exc:
        raise_http_exception(exc)
