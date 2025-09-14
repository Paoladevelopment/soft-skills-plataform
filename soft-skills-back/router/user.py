from fastapi import APIRouter, Depends, Query, Response, status
from schema.learning_goal import LearningGoalPaginatedResponse
from schema.pomodoro_preferences import (
    PomodoroConfiguration,
    PomodoroPreferencesUpdate, 
    PomodoroPreferencesResponse
)
from schema.token import TokenData
from schema.user import UserResponse, UserUpdate
from service.auth_service import decode_jwt_token
from service.learning_goal import LearningGoalService
from service.pomodoro_preferences import PomodoroPreferencesService
from service.user import UserService
from sqlmodel import Session
from utils.db import get_session
from utils.errors import APIException, raise_http_exception

router = APIRouter()

user_service = UserService()
learning_goal_service = LearningGoalService()
pomodoro_service = PomodoroPreferencesService()

@router.patch(
    "/me", 
    summary="Updates user data by ID", 
    response_model=UserResponse
)
def update_user(
    user: UserUpdate,
    token_data: TokenData = Depends(decode_jwt_token),
    session: Session = Depends(get_session)
):
    try:
        updated_user = user_service.update_user(token_data.user_id, user, session)
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
def delete_user(
    token_data: TokenData = Depends(decode_jwt_token),
    session: Session = Depends(get_session)
):
    try:
        return user_service.deactivate_user(token_data.user_id, session)
    
    except APIException as exc:
        raise_http_exception(exc)

@router.get(
    "/me/learning-goals",
    summary="Retrieve the learning goals of the authenticated user"
)
def get_my_learning_goals(
    offset: int = Query(0, ge=0, description="Number of items to skip"),
    limit: int = Query(10, le=100, description="Maximum number of items to retrieve (max 100)"),
    token_data: TokenData = Depends(decode_jwt_token),
    session: Session = Depends(get_session),
):
    try:
        learning_goals, total_count = learning_goal_service.get_all_user_learning_goals(token_data.user_id, offset, limit, session)
        
        return LearningGoalPaginatedResponse(
            message="Learning goals retrieved successfully",
            data=learning_goals,
            total=total_count,
            offset=offset,
            limit=limit
        )
    
    except APIException as exc:
        raise_http_exception(exc)


@router.get(
    "/me/pomodoro-preferences",
    summary="Get user's pomodoro preferences configuration",
    response_model=PomodoroConfiguration,
    status_code=status.HTTP_200_OK,
    tags=["Pomodoro Preferences"]
)
def get_pomodoro_preferences(
    token_data: TokenData = Depends(decode_jwt_token),
    session: Session = Depends(get_session),
):
    """
    Get user's pomodoro preferences configuration.
    
    Returns:
    - If configured: configured=true with user's preferences
    - If not configured: configured=false with fallback values and preferences=null
    """
    try:
        return pomodoro_service.get_user_preferences_status(token_data.user_id, session)
    
    except APIException as err:
        raise_http_exception(err)


@router.put(
    "/me/pomodoro-preferences",
    summary="Create or update user's pomodoro preferences",
    response_model=PomodoroPreferencesResponse,
    responses={
        201: {"description": "Preferences created successfully"},
        200: {"description": "Preferences updated successfully"},
        422: {"description": "Validation error"}
    },
    tags=["Pomodoro Preferences"]
)
def create_or_update_pomodoro_preferences(
    preferences_data: PomodoroPreferencesUpdate,
    response: Response,
    token_data: TokenData = Depends(decode_jwt_token),
    session: Session = Depends(get_session),
):
    """
    Create or update user's pomodoro preferences.
    
    Behavior:
    - If preferences don't exist: creates new record and returns 201 Created
    - If preferences exist: updates existing record and returns 200 OK
    - Validates all fields according to business rules
    """
    try:
        preferences, is_created = pomodoro_service.create_or_update_preferences(
            token_data.user_id, preferences_data, session
        )
        
        # Set appropriate status code
        if is_created:
            response.status_code = status.HTTP_201_CREATED
            message = "Pomodoro preferences created successfully"
        else:
            response.status_code = status.HTTP_200_OK
            message = "Pomodoro preferences updated successfully"
            
        return PomodoroPreferencesResponse(
            message=message,
            data=preferences
        )
    
    except APIException as err:
        raise_http_exception(err)