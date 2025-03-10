from fastapi import APIRouter, Depends, Query, status
from sqlmodel import Session

from model.user import User
from schema.learning_goal import (LearningGoalCreate, LearningGoalDetail,
                                  LearningGoalRead, LearningGoalResponse,
                                  LearningGoalUpdate)
from schema.objective import ObjectivePaginatedResponse
from schema.token import TokenData
from service.auth_service import decode_jwt_token
from service.learning_goal import LearningGoalService
from service.objective import ObjectiveService
from utils.db import get_session
from utils.errors import APIException, raise_http_exception

router = APIRouter()

learning_goal_service = LearningGoalService()
objective_service = ObjectiveService()

@router.post(
    "",
    response_model=LearningGoalResponse,
    summary="Create a learning goal",
    status_code=status.HTTP_201_CREATED,
)
def create_learning_goal(
    learning_goal: LearningGoalCreate, 
    token_data: TokenData = Depends(decode_jwt_token),
    session: Session = Depends(get_session)
):
    try:
        created_learning_goal =  learning_goal_service.create_learning_goal(token_data.user_id, learning_goal, session)
        learning_goal_data = LearningGoalRead.model_validate(created_learning_goal)

        return LearningGoalResponse(
            message="Learning goal created successfully",
            data=learning_goal_data
        )
    
    except APIException as exc:
        raise_http_exception(exc)
    

@router.get(
    "/{id}", 
    summary="Retrieve a learning goal by ID", 
    response_model=LearningGoalResponse
)
def get_learning_goal(
    id: str, 
    _: TokenData = Depends(decode_jwt_token),
    session: Session = Depends(get_session)
):
    try:
        learning_goal = learning_goal_service.get_learning_goal(id, session)
        learning_goal_data = LearningGoalDetail.model_validate(learning_goal)

        return LearningGoalResponse(
            message="Learning goal retrieved successfully",
            data=learning_goal_data
        )
    
    except APIException as exc:
        raise_http_exception(exc)


@router.get(
    "/{id}/objectives",
    summary="Get the objectives of a learning goal with optional filters"
)
def get_objectives_by_learning_goal(
    id: str,
    offset: int = Query(0, ge=0, description="Number of items to skip"),
    limit: int = Query(10, le=100, description="Maximum number of items to retrieve (max 100)"),
    _: TokenData = Depends(decode_jwt_token),
    session: Session = Depends(get_session),
):
    try:
        objectives, total_count = objective_service.get_objectives_by_learning_goal(id, offset, limit, session)

        return ObjectivePaginatedResponse(
            message="Objectives retrieved successfully",
            data=objectives,
            total=total_count,
            offset=offset,
            limit=limit
        )
    
    except APIException as exc:
        return raise_http_exception(exc)

@router.patch(
    "/{id}", 
    summary="Update learning goal details by ID", 
    response_model=LearningGoalResponse
)
def update_learning_goal(
    id: str, 
    learning_goal: LearningGoalUpdate, 
    token_data: TokenData = Depends(decode_jwt_token),
    session: Session = Depends(get_session)
):
    try:
        updated_learning_goal = learning_goal_service.update_learning_goal(id, learning_goal, token_data.user_id, session)
        learning_goal_data = LearningGoalRead.model_validate(updated_learning_goal)

        return LearningGoalResponse(
            message="Learning goal updated successfully",
            data=learning_goal_data
        )

    except APIException as exc:
        raise_http_exception(exc)


@router.delete(
    "/{id}", 
    summary="Delete a learning goal by ID"
)
def delete_module(
    id: str, 
    token_data: TokenData = Depends(decode_jwt_token),
    session: Session = Depends(get_session)
):
    try:
        return learning_goal_service.delete_learning_goal(id, token_data.user_id, session)
    
    except APIException as exc:
        raise_http_exception(exc)