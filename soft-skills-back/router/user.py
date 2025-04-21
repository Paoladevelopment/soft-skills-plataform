from fastapi import APIRouter, Depends, Query
from schema.learning_goal import LearningGoalPaginatedResponse
from schema.token import TokenData
from schema.user import UserResponse, UserUpdate
from service.auth_service import decode_jwt_token
from service.learning_goal import LearningGoalService
from service.user import UserService
from sqlmodel import Session
from utils.db import get_session
from utils.errors import APIException, raise_http_exception

router = APIRouter()

user_service = UserService()
learning_goal_service = LearningGoalService()

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