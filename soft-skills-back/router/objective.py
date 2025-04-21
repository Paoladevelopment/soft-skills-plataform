from typing import List, Optional
from uuid import UUID

from fastapi import APIRouter, Depends, Query, status
from schema.objective import (ObjectiveCreate, ObjectiveRead,
                              ObjectiveResponse, ObjectiveUpdate)
from schema.task import TaskPaginatedResponse
from schema.token import TokenData
from service.auth_service import decode_jwt_token
from service.objective import ObjectiveService
from service.task import TaskService
from sqlmodel import Session
from utils.db import get_session
from utils.errors import APIException, raise_http_exception

router = APIRouter()

objective_service = ObjectiveService()
task_service = TaskService()

@router.post(
	"",
	response_model=ObjectiveResponse,
	summary="Create a learning goal objective",
	status_code=status.HTTP_201_CREATED,
)
def create_objective(
    objective: ObjectiveCreate,
    _: TokenData = Depends(decode_jwt_token),
    session: Session = Depends(get_session)
):
    try:
        created_objective = objective_service.create_objective(objective, session)
        objective_data = ObjectiveRead.model_validate(created_objective)

        return ObjectiveResponse(
            message="Objective created successfully",
            data=objective_data
        )

    except APIException as err:
        raise_http_exception(err)


@router.get(
    "/{id}", 
    summary="Retrieve objective by ID", 
    response_model=ObjectiveResponse)
def get_objective(
    id: str, 
    _: TokenData = Depends(decode_jwt_token),
    session: Session = Depends(get_session)
):
    try:
        objective = objective_service.get_objective(UUID(id), session)
        objective_data = ObjectiveRead.model_validate(objective)

        return ObjectiveResponse(
            message="Objective retrieved successfully",
            data=objective_data
        )
    
    except APIException as err:
        raise_http_exception(err)

@router.get(
    "/{id}/tasks",
    summary="Retrieve tasks for a specific objective with optional filters and sorting",
    response_model=TaskPaginatedResponse
)
def get_tasks_by_objective(
    id: str,
    offset: int = Query(0, ge=0, description="Number of items to skip"),
    limit: int = Query(10, le=100, description="Maximum number of items to retrieve (max 100)"),
    status: Optional[str] = Query(None, description="Filter by status ('completed', 'in_progress', etc.)"),
    priority: Optional[str] = Query(None, description="Filter by priority ('high', 'medium', 'low')"),
    order_by: List[str] = Query(None, description="Sorting criteria"),
    _: TokenData = Depends(decode_jwt_token),
    session: Session = Depends(get_session),
):
    try:
        tasks, total_count = task_service.get_tasks_by_objective(id, offset, limit, status, priority, order_by, session)

        return TaskPaginatedResponse(
            message="Tasks retrieved successfully",
            data=tasks,
            total=total_count,
            offset=offset,
            limit=limit
        )
    
    except APIException as err:
        return raise_http_exception(err)


@router.patch(
    "/{id}",
    summary="Update objective details by ID", 
    response_model=ObjectiveResponse
)
def update_objective(
    id: str,
    objective: ObjectiveUpdate,
    token_data: TokenData = Depends(decode_jwt_token),
    session: Session = Depends(get_session),
):
    try:
        updated_objective = objective_service.update_objective(UUID(id), objective, token_data.user_id, session)
        objective_data = ObjectiveRead.model_validate(updated_objective)

        return ObjectiveResponse(
            message="Objective updated successfully",
            data=objective_data
        )

    except APIException as err:
        raise_http_exception(err)

@router.delete(
    "/{id}",
    summary="Delete a objective by ID"
)
def delete_objective(
    id: str,
    token_data: TokenData = Depends(decode_jwt_token),
    session: Session = Depends(get_session),
):
    try:
        return objective_service.delete_objective(UUID(id), token_data.user_id, session)
    
    except APIException as err:
        raise_http_exception(err)