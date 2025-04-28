from fastapi import APIRouter, Depends, status
from typing import List

from nosql_models.roadmap import Roadmap
from nosql_schema.roadmap import RoadmapCreate, RoadmapUpdate, RoadmapResponse
from schema.token import TokenData
from mongo_service.roadmap import RoadmapMongoService
from service.auth_service import decode_jwt_token
from utils.errors import APIException, raise_http_exception

router = APIRouter()

roadmap_service = RoadmapMongoService()

@router.post(
    "",
    response_model=RoadmapResponse,
    summary="Create roadmap",
    status_code=status.HTTP_201_CREATED,
)
def create_roadmap(
    roadmap_data: RoadmapCreate,
    token_data: TokenData = Depends(decode_jwt_token),
):
    try:
        roadmap_dict = roadmap_data.model_dump()
        roadmap_dict["user_id"] = token_data.user_id
        inserted_id = roadmap_service.add_roadmap(roadmap_dict)

        roadmap_dict["roadmap_id"] = inserted_id
        return RoadmapResponse(
            message="Roadmap created successfully",
            data=Roadmap(**roadmap_dict)
        )

    except APIException as err:
        raise_http_exception(err)

@router.get(
    "/mine",
    summary="Get my roadmaps",
    response_model=List[Roadmap]
)
def get_user_roadmaps(
    token_data: TokenData = Depends(decode_jwt_token),
):
    try:
        user_id = str(token_data.user_id)
        return roadmap_service.get_user_roadmaps(user_id)

    except APIException as err:
        raise_http_exception(err)


@router.get(
    "/public",
    summary="Get all public roadmaps",
    response_model=List[Roadmap],
    status_code=status.HTTP_200_OK,
)
def get_public_roadmaps(
    token_data: TokenData = Depends(decode_jwt_token),
):
    try:
        return roadmap_service.get_public_roadmaps()

    except APIException as err:
        raise_http_exception(err)

@router.get(
    "/{id}",
    summary="Get roadmap by ID",
    response_model=RoadmapResponse
)
def get_roadmap(
    id: str,
    token_data: TokenData = Depends(decode_jwt_token),
):
    try:
        roadmap = roadmap_service.get_roadmap_by_id(id)
        return RoadmapResponse(
            message="Roadmap retrieved successfully",
            data=roadmap
        )

    except APIException as err:
        raise_http_exception(err)

@router.patch(
    "/{id}",
    summary="Update roadmap by ID",
    response_model=RoadmapResponse
)
def update_roadmap(
    id: str,
    update_data: RoadmapUpdate,
    token_data: TokenData = Depends(decode_jwt_token),
):
    try:
        success = roadmap_service.update_roadmap(id, update_data.model_dump(mode="json", exclude_none=True))

        if success:
            roadmap = roadmap_service.get_roadmap_by_id(id)
            return RoadmapResponse(
                message="Roadmap updated successfully",
                data=roadmap
            )

    except APIException as err:
        raise_http_exception(err)


@router.delete(
    "/{id}",
    summary="Delete roadmap by ID"
)
def delete_roadmap(
    id: str,
    token_data: TokenData = Depends(decode_jwt_token),
):
    try:
        return roadmap_service.delete_roadmap(id)

    except APIException as err:
        raise_http_exception(err)
