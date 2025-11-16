from typing import List, Optional
from uuid import UUID

from fastapi import APIRouter, Depends, Query, status
from schema.learning_goal import (LearningGoalCreate, LearningGoalRead, 
                                  LearningGoalResponse, LearningGoalUpdate)
from schema.objective import ObjectivePaginatedResponse
from schema.token import TokenData
from service.auth_service import decode_jwt_token
from service.learning_goal import LearningGoalService
from service.objective import ObjectiveService
from sqlmodel import Session
from utils.db import get_session
from utils.errors import APIException, raise_http_exception

router = APIRouter()

learning_goal_service = LearningGoalService()
objective_service = ObjectiveService()

@router.post(
    "",
    response_model=LearningGoalResponse,
    summary="Crear meta de aprendizaje",
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
            message="Meta de aprendizaje creada correctamente",
            data=learning_goal_data
        )
    
    except APIException as err:
        raise_http_exception(err)
    

@router.get(
    "/{id}", 
    summary="Obtener meta de aprendizaje por ID", 
    response_model=LearningGoalResponse
)
def get_learning_goal(
    id: str, 
    _: TokenData = Depends(decode_jwt_token),
    session: Session = Depends(get_session)
):
    try:
        learning_goal = learning_goal_service.get_learning_goal(UUID(id), session)
        learning_goal_data = LearningGoalRead.model_validate(learning_goal)

        return LearningGoalResponse(
            message="Meta de aprendizaje obtenida correctamente",
            data=learning_goal_data
        )
    
    except APIException as err:
        raise_http_exception(err)


@router.get(
    "/{id}/objectives",
    summary="Obtener objetivos de una meta de aprendizaje con filtros opcionales",
    response_model=ObjectivePaginatedResponse
)
def get_objectives_by_learning_goal(
    id: str,
    offset: int = Query(0, ge=0, description="Número de elementos a omitir"),
    limit: int = Query(10, le=100, description="Número máximo de elementos a recuperar (máx. 100)"),
    status: Optional[str] = Query(None, description="Filtrar por estado ('completed', 'in_progress', etc.)"),
    priority: List[str] = Query(None, description="Filtrar por valores de prioridad ('high', 'medium', 'low'). Se pueden especificar múltiples valores."),
    search: Optional[str] = Query(None, description="Buscar objetivos por título o descripción"),
    order_by: List[str] = Query(None, description="Criterios de ordenamiento"),
    _: TokenData = Depends(decode_jwt_token),
    session: Session = Depends(get_session),
):
    try:
        objectives, total_count = objective_service.get_objectives_by_learning_goal(
            id, offset, limit, status, priority, search, order_by, session
        )

        return ObjectivePaginatedResponse(
            message="Objetivos obtenidos correctamente",
            data=objectives,
            total=total_count,
            offset=offset,
            limit=limit
        )
    
    except APIException as err:
        return raise_http_exception(err)

@router.patch(
    "/{id}", 
    summary="Actualizar detalles de meta de aprendizaje por ID", 
    response_model=LearningGoalResponse
)
def update_learning_goal(
    id: str, 
    learning_goal: LearningGoalUpdate, 
    token_data: TokenData = Depends(decode_jwt_token),
    session: Session = Depends(get_session)
):
    try:
        updated_learning_goal = learning_goal_service.update_learning_goal(UUID(id), learning_goal, token_data.user_id, session)
        learning_goal_data = LearningGoalRead.model_validate(updated_learning_goal)

        return LearningGoalResponse(
            message="Meta de aprendizaje actualizada correctamente",
            data=learning_goal_data
        )

    except APIException as err:
        raise_http_exception(err)


@router.delete(
    "/{id}", 
    summary="Eliminar meta de aprendizaje por ID"
)
def delete_learning_goal(
    id: str, 
    token_data: TokenData = Depends(decode_jwt_token),
    session: Session = Depends(get_session)
):
    try:
        return learning_goal_service.delete_learning_goal(UUID(id), token_data.user_id, session)
    
    except APIException as err:
        raise_http_exception(err)


@router.post(
    "/{id}/convert-to-roadmap",
    summary="Convertir meta de aprendizaje a hoja de ruta de aprendizaje",
    status_code=status.HTTP_201_CREATED,
)
def convert_learning_goal_to_roadmap(
    id: str,
    token_data: TokenData = Depends(decode_jwt_token),
    session: Session = Depends(get_session)
):
    try:
        result = learning_goal_service.convert_to_roadmap(UUID(id), token_data.user_id, session)
        return result
    
    except APIException as err:
        raise_http_exception(err)