from fastapi import APIRouter, Depends, status
from schema.task_resource import TaskResourceCreate, TaskResourceRead, TaskResourceResponse, TaskResourceListResponse, TaskResourceUpdate
from schema.token import TokenData
from service.auth_service import decode_jwt_token
from service.task_resource import TaskResourceService
from sqlmodel import Session
from utils.db import get_session
from utils.errors import APIException, raise_http_exception, validate_uuid

router = APIRouter()

task_resource_service = TaskResourceService()


@router.post(
    "/{task_id}/resources",
    response_model=TaskResourceResponse,
    summary="Agregar recurso a una tarea",
    status_code=status.HTTP_201_CREATED,
)
def create_task_resource(
    task_id: str,
    resource: TaskResourceCreate,
    token_data: TokenData = Depends(decode_jwt_token),
    session: Session = Depends(get_session)
):
    try:
        task_uuid = validate_uuid(task_id, "ID de tarea")
        
        created_resource = task_resource_service.create_task_resource(task_uuid, resource, token_data.user_id, session)

        return TaskResourceResponse(
            message="Recurso creado correctamente",
            data=created_resource
        )

    except APIException as err:
        raise_http_exception(err)


@router.get(
    "/{task_id}/resources",
    summary="Obtener todos los recursos de una tarea",
    response_model=TaskResourceListResponse
)
def get_task_resources(
    task_id: str,
    token_data: TokenData = Depends(decode_jwt_token),
    session: Session = Depends(get_session)
):
    try:
        task_uuid = validate_uuid(task_id, "ID de tarea")
        
        resources = task_resource_service.get_task_resources(task_uuid, token_data.user_id, session)
        
        return TaskResourceListResponse(
            message="Recursos obtenidos correctamente",
            data=resources
        )

    except APIException as err:
        raise_http_exception(err)


@router.patch(
    "/{task_id}/resources/{resource_id}",
    summary="Actualizar recurso de una tarea",
    response_model=TaskResourceResponse
)
def update_task_resource(
    task_id: str,
    resource_id: str,
    resource: TaskResourceUpdate,
    token_data: TokenData = Depends(decode_jwt_token),
    session: Session = Depends(get_session),
):
    try:
        task_uuid = validate_uuid(task_id, "ID de tarea")
        resource_uuid = validate_uuid(resource_id, "ID de recurso")
        
        updated_resource = task_resource_service.update_task_resource(task_uuid, resource_uuid, resource, token_data.user_id, session)

        return TaskResourceResponse(
            message="Recurso actualizado correctamente",
            data=updated_resource
        )

    except APIException as err:
        raise_http_exception(err)


@router.delete(
    "/{task_id}/resources/{resource_id}",
    summary="Eliminar recurso de una tarea"
)
def delete_task_resource(
    task_id: str,
    resource_id: str,
    token_data: TokenData = Depends(decode_jwt_token),
    session: Session = Depends(get_session),
):
    try:
        task_uuid = validate_uuid(task_id, "ID de tarea")
        resource_uuid = validate_uuid(resource_id, "ID de recurso")
        
        return task_resource_service.delete_task_resource(task_uuid, resource_uuid, token_data.user_id, session)

    except APIException as err:
        raise_http_exception(err)

