from enums.common import Status
from fastapi import APIRouter, Depends, status
from schema.task import TaskCreate, TaskRead, TaskResponse, TaskUpdate
from schema.token import TokenData
from service.auth_service import decode_jwt_token
from service.task import TaskService
from sqlmodel import Session
from utils.db import get_session
from utils.errors import APIException, raise_http_exception, validate_uuid
from router import task_notes, task_resources

router = APIRouter()

task_service = TaskService()

router.include_router(task_notes.router, tags=["Task Notes"])
router.include_router(task_resources.router, tags=["Task Resources"])

@router.post(
	"",
	response_model=TaskResponse,
	summary="Crear tarea",
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
            message="Tarea creada correctamente",
            data=task_data
        )

    except APIException as err:
        raise_http_exception(err)


@router.get(
    "/{id}", 
    summary="Obtener tarea por ID", 
    response_model=TaskResponse)
def get_task(
    id: str, 
    _: TokenData = Depends(decode_jwt_token),
    session: Session = Depends(get_session)
):
    try:
        task_uuid = validate_uuid(id, "ID de tarea")
        
        task = task_service.get_task(task_uuid, session)
        task_data = TaskRead.model_validate(task)

        return TaskResponse(
            message="Tarea obtenida correctamente",
            data=task_data
        )
    
    except APIException as err:
        raise_http_exception(err)


@router.patch(
    "/{id}",
    summary="Actualizar detalles de tarea por ID", 
    response_model=TaskResponse
)
def update_task(
    id: str,
    task: TaskUpdate,
    token_data: TokenData = Depends(decode_jwt_token),
    session: Session = Depends(get_session),
):
    try:
        task_uuid = validate_uuid(id, "ID de tarea")
        
        updated_task = task_service.update_task(task_uuid, task, token_data.user_id, session)
        task_data = TaskRead.model_validate(updated_task)

        return TaskResponse(
            message="Tarea actualizada correctamente",
            data=task_data
        )

    except APIException as err:
        raise_http_exception(err)

@router.patch(
    "/{id}/status",
    summary="Actualizar estado de tarea",
    response_model=TaskResponse
)
def update_task_status(
    id: str,
    new_status: Status,
    token_data: TokenData = Depends(decode_jwt_token),
    session: Session = Depends(get_session),
):
    try: 
        task_uuid = validate_uuid(id, "ID de tarea")
        
        updated_task = task_service.update_task_status(task_uuid, new_status, token_data.user_id, session)
        return TaskResponse(
            message=f"Estado de tarea cambiado a {new_status.value}",
            data=updated_task
        )
    
    except APIException as api_error:
        raise_http_exception(api_error)
    
    
@router.delete(
    "/{id}",
    summary="Eliminar tarea por ID"
)
def delete_objective(
    id: str,
    token_data: TokenData = Depends(decode_jwt_token),
    session: Session = Depends(get_session),
):
    try:
        task_uuid = validate_uuid(id, "ID de tarea")
        
        return task_service.delete_task(task_uuid, token_data.user_id, session)
    
    except APIException as err:
        raise_http_exception(err)