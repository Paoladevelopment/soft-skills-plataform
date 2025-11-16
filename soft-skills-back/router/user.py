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
    summary="Actualizar datos de usuario por ID", 
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
            message="Usuario actualizado correctamente",
            data=updated_user
        )
    
    except APIException as exc:
        raise_http_exception(exc)


@router.delete(
    "/me", 
    summary="Eliminar usuario autenticado"
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
    summary="Obtener metas de aprendizaje del usuario autenticado"
)
def get_my_learning_goals(
    offset: int = Query(0, ge=0, description="Número de elementos a omitir"),
    limit: int = Query(10, le=100, description="Número máximo de elementos a recuperar (máx. 100)"),
    token_data: TokenData = Depends(decode_jwt_token),
    session: Session = Depends(get_session),
):
    try:
        learning_goals, total_count = learning_goal_service.get_all_user_learning_goals(token_data.user_id, offset, limit, session)
        
        return LearningGoalPaginatedResponse(
            message="Metas de aprendizaje obtenidas correctamente",
            data=learning_goals,
            total=total_count,
            offset=offset,
            limit=limit
        )
    
    except APIException as exc:
        raise_http_exception(exc)


@router.get(
    "/me/pomodoro-preferences",
    summary="Obtener configuración de preferencias pomodoro del usuario",
    response_model=PomodoroConfiguration,
    status_code=status.HTTP_200_OK,
    tags=["Pomodoro Preferences"]
)
def get_pomodoro_preferences(
    token_data: TokenData = Depends(decode_jwt_token),
    session: Session = Depends(get_session),
):
    """
    Obtener configuración de preferencias pomodoro del usuario.
    
    Retorna:
    - Si está configurado: configured=true con las preferencias del usuario
    - Si no está configurado: configured=false con valores predeterminados y preferences=null
    """
    try:
        return pomodoro_service.get_user_preferences_status(token_data.user_id, session)
    
    except APIException as err:
        raise_http_exception(err)


@router.put(
    "/me/pomodoro-preferences",
    summary="Crear o actualizar preferencias pomodoro del usuario",
    response_model=PomodoroPreferencesResponse,
    responses={
        201: {"description": "Preferencias creadas correctamente"},
        200: {"description": "Preferencias actualizadas correctamente"},
        422: {"description": "Error de validación"}
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
    Crear o actualizar preferencias pomodoro del usuario.
    
    Comportamiento:
    - Si las preferencias no existen: crea un nuevo registro y retorna 201 Created
    - Si las preferencias existen: actualiza el registro existente y retorna 200 OK
    - Valida todos los campos según las reglas de negocio
    """
    try:
        preferences, is_created = pomodoro_service.create_or_update_preferences(
            token_data.user_id, preferences_data, session
        )
        
        # Set appropriate status code
        if is_created:
            response.status_code = status.HTTP_201_CREATED
            message = "Preferencias pomodoro creadas correctamente"
        else:
            response.status_code = status.HTTP_200_OK
            message = "Preferencias pomodoro actualizadas correctamente"
            
        return PomodoroPreferencesResponse(
            message=message,
            data=preferences
        )
    
    except APIException as err:
        raise_http_exception(err)