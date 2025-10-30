from typing import List, Optional

from fastapi import APIRouter, Depends, Query, status
from enums.common import Status
from schema.kanban import KanbanBoardResponse, KanbanColumnPaginatedResponse, KanbanMoveRequest, KanbanMoveResponse
from schema.objective import (ObjectiveCreate, ObjectiveRead,
                              ObjectiveResponse, ObjectiveUpdate)
from schema.task import TaskPaginatedResponse
from schema.token import TokenData
from service.auth_service import decode_jwt_token
from service.objective import ObjectiveService
from service.kanban import KanbanService
from service.task import TaskService
from sqlmodel import Session
from utils.db import get_session
from utils.errors import APIException, raise_http_exception, validate_uuid

router = APIRouter()

objective_service = ObjectiveService()
kanban_service = KanbanService()
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
        objective_uuid = validate_uuid(id, "objective ID")
        objective = objective_service.get_objective(objective_uuid, session)
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
        objective_uuid = validate_uuid(id, "objective ID")
        updated_objective = objective_service.update_objective(objective_uuid, objective, token_data.user_id, session)
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
        objective_uuid = validate_uuid(id, "objective ID")
        return objective_service.delete_objective(objective_uuid, token_data.user_id, session)
    
    except APIException as err:
        raise_http_exception(err)


@router.get(
    "/{id}/kanban",
    summary="Get Kanban board for an objective with first page of each status",
    response_model=KanbanBoardResponse
)
def get_kanban_board(
    id: str,
    per_page: int = Query(10, ge=1, le=100, description="Items per page for each column (max 100)"),
    _: TokenData = Depends(decode_jwt_token),
    session: Session = Depends(get_session),
):
    try:
        objective_uuid = validate_uuid(id, "objective ID")
        kanban_data = kanban_service.get_kanban_board(objective_uuid, per_page, session)
        return KanbanBoardResponse(**kanban_data)
    
    except APIException as err:
        raise_http_exception(err)


@router.get(
    "/{id}/kanban/column",
    summary="Get paginated tasks for a specific Kanban column",
    response_model=KanbanColumnPaginatedResponse
)
def get_kanban_column(
    id: str,
    status: Status = Query(..., description="Column status"),
    page: int = Query(1, ge=1, description="Page number"),
    per_page: int = Query(20, ge=1, le=100, description="Items per page (max 100)"),
    _: TokenData = Depends(decode_jwt_token),
    session: Session = Depends(get_session),
):
    try:
        objective_uuid = validate_uuid(id, "objective ID")
        column_data = kanban_service.get_kanban_column(objective_uuid, status.value, page, per_page, session)
        return KanbanColumnPaginatedResponse(**column_data)
    
    except APIException as err:
        raise_http_exception(err)


@router.patch(
    "/{id}/kanban/move",
    summary="Move a task in the Kanban board",
    response_model=KanbanMoveResponse,
    status_code=status.HTTP_200_OK
)
def move_kanban_task(
    id: str,
    move_request: KanbanMoveRequest,
    token_data: TokenData = Depends(decode_jwt_token),
    session: Session = Depends(get_session),
):
    try:
        objective_uuid = validate_uuid(id, "objective ID")
        result = kanban_service.move_kanban_task(objective_uuid, move_request, token_data.user_id, session)
        
        return KanbanMoveResponse(
            message=result["message"],
            data=result["task"],
            old=result["old"]
        )
    
    except APIException as err:
        raise_http_exception(err)


@router.post(
    "/{id}/kanban/sync",
    summary="Sync Kanban board with actual task statuses",
    status_code=status.HTTP_200_OK
)
def sync_kanban_board(
    id: str,
    _: TokenData = Depends(decode_jwt_token),
    session: Session = Depends(get_session),
):
    try:
        objective_uuid = validate_uuid(id, "objective ID")
        result = kanban_service.sync_kanban_with_task_statuses(objective_uuid, session)
        return result
    
    except APIException as err:
        raise_http_exception(err)