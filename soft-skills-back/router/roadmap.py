from fastapi import APIRouter, Depends, status, Query
from fastapi.responses import JSONResponse
from typing import Optional
from datetime import datetime

from nosql_schema.roadmap import RoadmapCreate, RoadmapUpdate, RoadmapResponse, PaginatedRoadmapsResponse
from schema.token import TokenData
from mongo_service.roadmap import RoadmapMongoService
from service.auth_service import decode_jwt_token
from utils.errors import APIException, raise_http_exception
from utils.db import get_session
from sqlmodel import Session

router = APIRouter()

roadmap_service = RoadmapMongoService()

@router.post(
    "",
    response_model=RoadmapResponse,
    summary="Crear hoja de ruta de aprendizaje",
    status_code=status.HTTP_201_CREATED,
)
def create_roadmap(
    roadmap_data: RoadmapCreate,
    token_data: TokenData = Depends(decode_jwt_token),
    session: Session = Depends(get_session),
):
    try:
        roadmap_dict = roadmap_data.model_dump()
        user_id = str(token_data.user_id)
        result_dict = roadmap_service.add_roadmap(roadmap_dict, user_id, session)

        return RoadmapResponse(
            message="Hoja de ruta de aprendizaje creada correctamente",
            data=result_dict
        )

    except APIException as err:
        raise_http_exception(err)

@router.get(
    "/mine",
    summary="Obtener mis hojas de ruta de aprendizaje",
    response_model=PaginatedRoadmapsResponse
)
def get_user_roadmaps(
    offset: int = Query(0, ge=0, description="Número de elementos a omitir antes de comenzar a recopilar el conjunto de resultados"),
    limit: int = Query(10, ge=10, le=50,  description="Número máximo de elementos a recuperar (entre 10 y 50)"),
    token_data: TokenData = Depends(decode_jwt_token),
):
    try:
        user_id = str(token_data.user_id)
        return roadmap_service.get_user_roadmaps(user_id, offset, limit)

    except APIException as err:
        raise_http_exception(err)


@router.get(
    "/public",
    summary="Obtener todas las hojas de ruta de aprendizaje públicas",
    response_model=PaginatedRoadmapsResponse,
    status_code=status.HTTP_200_OK,
)
def get_public_roadmaps(
    offset: int = Query(0, ge=0, description="Número de elementos a omitir antes de comenzar a recopilar el conjunto de resultados"),
    limit: int = Query(10, ge=10, le=50,  description="Número máximo de elementos a recuperar (entre 10 y 50)"),
    title: Optional[str] = Query(None, description="Filtrar por título de hoja de ruta de aprendizaje (coincidencia parcial)"),
    description: Optional[str] = Query(None, description="Filtrar por descripción de hoja de ruta de aprendizaje (coincidencia parcial)"),
    created_at_from: Optional[datetime] = Query(None, description="Filtrar hojas de ruta de aprendizaje creadas desde esta fecha"),
    created_at_to: Optional[datetime] = Query(None, description="Filtrar hojas de ruta de aprendizaje creadas hasta esta fecha"),
    steps_min: Optional[int] = Query(None, ge=0, description="Número mínimo de pasos"),
    steps_max: Optional[int] = Query(None, ge=0, description="Número máximo de pasos"),
    username: Optional[str] = Query(None, description="Filtrar por nombre de usuario que creó la hoja de ruta de aprendizaje"),
    _: TokenData = Depends(decode_jwt_token),
):
    try:
        return roadmap_service.get_public_roadmaps(
            offset=offset,
            limit=limit,
            title=title,
            description=description,
            created_at_from=created_at_from,
            created_at_to=created_at_to,
            steps_min=steps_min,
            steps_max=steps_max,
            username=username
        )

    except APIException as err:
        raise_http_exception(err)

@router.get(
    "/{id}",
    summary="Obtener hoja de ruta de aprendizaje por ID",
    response_model=RoadmapResponse,
)
def get_roadmap(
    id: str,
    _: TokenData = Depends(decode_jwt_token),
):
    try:
        roadmap = roadmap_service.get_roadmap_by_id(id)
        return RoadmapResponse(
            message="Hoja de ruta de aprendizaje obtenida correctamente",
            data=roadmap
        )

    except APIException as err:
        raise_http_exception(err)

@router.patch(
    "/{id}",
    summary="Actualizar hoja de ruta de aprendizaje por ID",
    response_model=RoadmapResponse
)
async def update_roadmap(
    id: str,
    update_data: RoadmapUpdate,
    _: TokenData = Depends(decode_jwt_token),
):
    try:
        success = roadmap_service.update_roadmap(id, update_data.model_dump(mode="json", exclude_none=True))

        if success:
            roadmap = roadmap_service.get_roadmap_by_id(id)
            return RoadmapResponse(
                message="Hoja de ruta de aprendizaje actualizada correctamente",
                data=roadmap
            )

    except APIException as err:
        raise_http_exception(err)


@router.delete(
    "/{id}",
    summary="Eliminar hoja de ruta de aprendizaje por ID"
)
def delete_roadmap(
    id: str,
    _: TokenData = Depends(decode_jwt_token),
):
    try:
        roadmap_service.delete_roadmap(id)
        return JSONResponse(status_code=200, content={"message": "Hoja de ruta de aprendizaje eliminada correctamente."})

    except APIException as err:
        raise_http_exception(err)
