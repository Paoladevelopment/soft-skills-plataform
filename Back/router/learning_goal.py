from fastapi import APIRouter, Depends, Query, status
from sqlmodel import Session
from utils.db import get_session
from utils.errors import APIException, raise_http_exception
from model.user import User
from schema.learning_goal import LearningGoalCreate, LearningGoalRead, LearningGoalUpdate, LearningGoalPaginatedResponse, LearningGoalResponse
from service.learning_goal import LearningGoalService
from service.auth_service import get_current_user

router = APIRouter()
learning_goal_service = LearningGoalService()

@router.post(
    "",
    response_model=LearningGoalResponse,
    summary="Create a learning goal",
    status_code=status.HTTP_201_CREATED,
)
def create_learning_goal(
    learning_goal: LearningGoalCreate, 
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
    ):
    try:
        created_learning_goal =  learning_goal_service.create_learning_goal(current_user.user_id, learning_goal, session)
        learning_goal_data = LearningGoalRead.model_validate(created_learning_goal)

        return LearningGoalResponse(
            message="Learning goal created successfully",
            data=learning_goal_data
        )
    
    except APIException as exc:
        raise_http_exception(exc)
    

@router.get("/user/{user_id}", summary="Retrieve user learning goals", response_model=LearningGoalPaginatedResponse)
def get_all_user_learning_goals(
        user_id: str,
        offset: int = Query(0, ge=0, description="Number of items to skip"),
        limit: int = Query(10, le=100, description="Maximum number of items to retrieve (max 100)"),
        current_user = Depends(get_current_user),
        session: Session = Depends(get_session),
    ):

    try:
        learning_goals, total_count = learning_goal_service.get_all_user_learning_goals(user_id, offset, limit, session)
        return LearningGoalPaginatedResponse(
            message="Learning goals retrieved successfully",
            data=learning_goals,
            total=total_count,
            offset=offset,
            limit=limit
        )
    
    except APIException as exc:
        raise_http_exception(exc)


@router.get("/{id}", summary="Retrieve a learning goal by ID", response_model=LearningGoalResponse)
def get_learning_goal(id: str, current_user = Depends(get_current_user), session: Session = Depends(get_session)):
    try:
        learning_goal = learning_goal_service.get_learning_goal(id, session)
        learning_goal_data = LearningGoalRead.model_validate(learning_goal)

        return LearningGoalResponse(
            message="Learning goal retrieved successfully",
            data=learning_goal_data
        )
    
    except APIException as exc:
        raise_http_exception(exc)


@router.patch(
    "/{id}", summary="Update learning goal details by ID", response_model=LearningGoalResponse
)
def update_learning_goal(
    id: str, 
    learning_goal: LearningGoalUpdate, 
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
    ):
    try:
        updated_learning_goal = learning_goal_service.update_learning_goal(id, learning_goal, session)
        learning_goal_data = LearningGoalRead.model_validate(updated_learning_goal)

        return LearningGoalResponse(
            message="Learning goal updated successfully",
            data=learning_goal_data
        )

    except APIException as exc:
        raise_http_exception(exc)


@router.delete("/{id}", summary="Delete a learning goal by ID")
def delete_module(
    id: str, 
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
    ):
    try:
        return learning_goal_service.delete_learning_goal(id, session)
    
    except APIException as exc:
        raise_http_exception(exc)