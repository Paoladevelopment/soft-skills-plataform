from fastapi import APIRouter, Depends, status
from schema.task_note import TaskNoteCreate, TaskNoteRead, TaskNoteResponse, TaskNoteListResponse, TaskNoteUpdate
from schema.token import TokenData
from service.auth_service import decode_jwt_token
from service.task_note import TaskNoteService
from sqlmodel import Session
from utils.db import get_session
from utils.errors import APIException, raise_http_exception, validate_uuid

router = APIRouter()

task_note_service = TaskNoteService()


@router.post(
    "/{task_id}/notes",
    response_model=TaskNoteResponse,
    summary="Agregar nota a una tarea",
    status_code=status.HTTP_201_CREATED,
)
def create_task_note(
    task_id: str,
    note: TaskNoteCreate,
    token_data: TokenData = Depends(decode_jwt_token),
    session: Session = Depends(get_session)
):
    try:
        task_uuid = validate_uuid(task_id, "ID de tarea")
        
        created_note = task_note_service.create_task_note(task_uuid, note, token_data.user_id, session)

        return TaskNoteResponse(
            message="Nota creada correctamente",
            data=created_note
        )

    except APIException as err:
        raise_http_exception(err)


@router.get(
    "/{task_id}/notes",
    summary="Obtener todas las notas de una tarea",
    response_model=TaskNoteListResponse
)
def get_task_notes(
    task_id: str,
    token_data: TokenData = Depends(decode_jwt_token),
    session: Session = Depends(get_session)
):
    try:
        task_uuid = validate_uuid(task_id, "ID de tarea")
        
        notes = task_note_service.get_task_notes(task_uuid, token_data.user_id, session)
        
        return TaskNoteListResponse(
            message="Notas obtenidas correctamente",
            data=notes
        )

    except APIException as err:
        raise_http_exception(err)


@router.patch(
    "/{task_id}/notes/{note_id}",
    summary="Actualizar nota de una tarea",
    response_model=TaskNoteResponse
)
def update_task_note(
    task_id: str,
    note_id: str,
    note: TaskNoteUpdate,
    token_data: TokenData = Depends(decode_jwt_token),
    session: Session = Depends(get_session),
):
    try:
        task_uuid = validate_uuid(task_id, "ID de tarea")
        note_uuid = validate_uuid(note_id, "ID de nota")
        
        updated_note = task_note_service.update_task_note(task_uuid, note_uuid, note, token_data.user_id, session)

        return TaskNoteResponse(
            message="Nota actualizada correctamente",
            data=updated_note
        )

    except APIException as err:
        raise_http_exception(err)


@router.delete(
    "/{task_id}/notes/{note_id}",
    summary="Eliminar nota de una tarea"
)
def delete_task_note(
    task_id: str,
    note_id: str,
    token_data: TokenData = Depends(decode_jwt_token),
    session: Session = Depends(get_session),
):
    try:
        task_uuid = validate_uuid(task_id, "ID de tarea")
        note_uuid = validate_uuid(note_id, "ID de nota")
        
        return task_note_service.delete_task_note(task_uuid, note_uuid, token_data.user_id, session)

    except APIException as err:
        raise_http_exception(err)

