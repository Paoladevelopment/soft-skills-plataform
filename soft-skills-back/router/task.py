from uuid import UUID

from enums.common import Status
from fastapi import APIRouter, Depends, status
from schema.task import TaskCreate, TaskRead, TaskResponse, TaskUpdate
from schema.token import TokenData
from service.auth_service import decode_jwt_token
from service.task import TaskService
from sqlmodel import Session
from utils.db import get_session
from utils.errors import APIException, raise_http_exception

router = APIRouter()

task_service = TaskService()

@router.post(
	"",
	response_model=TaskResponse,
	summary="Create task",
	status_code=status.HTTP_201_CREATED,
)
def create_task(
    task: TaskCreate,
    token_data: TokenData = Depends(decode_jwt_token),
    session: Session = Depends(get_session)
):
    try:
        created_task = task_service.create_task(task, token_data.user_id, session)
        task_data = TaskRead.model_validate(created_task)

        return TaskResponse(
            message="Task created successfully",
            data=task_data
        )

    except APIException as err:
        raise_http_exception(err)


@router.get(
    "/{id}", 
    summary="Retrieve task by ID", 
    response_model=TaskResponse)
def get_task(
    id: str, 
    _: TokenData = Depends(decode_jwt_token),
    session: Session = Depends(get_session)
):
    try:
        task = task_service.get_task(UUID(id), session)
        task_data = TaskRead.model_validate(task)

        return TaskResponse(
            message="Task retrieved successfully",
            data=task_data
        )
    
    except APIException as err:
        raise_http_exception(err)


@router.patch(
    "/{id}",
    summary="Update task details by ID", 
    response_model=TaskResponse
)
def update_task(
    id: str,
    task: TaskUpdate,
    token_data: TokenData = Depends(decode_jwt_token),
    session: Session = Depends(get_session),
):
    try:
        updated_task = task_service.update_task(UUID(id), task, token_data.user_id, session)
        task_data = TaskRead.model_validate(updated_task)

        return TaskResponse(
            message="Task updated successfully",
            data=task_data
        )

    except APIException as err:
        raise_http_exception(err)

@router.patch(
    "/{id}/status",
    summary="Update task status",
    response_model=TaskResponse
)
def update_task_status(
    id: str,
    new_status: Status,
    token_data: TokenData = Depends(decode_jwt_token),
    session: Session = Depends(get_session),
):
    try: 
        updated_task = task_service.update_task_status(UUID(id), new_status, token_data.user_id, session)
        return TaskResponse(
            message=f"Task status changed to {new_status.value}",
            data=updated_task
        )
    
    except APIException as api_error:
        raise_http_exception(api_error)
    
    
@router.delete(
    "/{id}",
    summary="Delete task by ID"
)
def delete_objective(
    id: str,
    token_data: TokenData = Depends(decode_jwt_token),
    session: Session = Depends(get_session),
):
    try:
        return task_service.delete_task(UUID(id), token_data.user_id, session)
    
    except APIException as err:
        raise_http_exception(err)