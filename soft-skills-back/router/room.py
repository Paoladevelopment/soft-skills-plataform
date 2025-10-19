from uuid import UUID
from fastapi import APIRouter, Depends, Query, status

from schema.listening_core.room import (
    RoomCreate, RoomRead, RoomDetail, RoomUpdate, RoomResponse, RoomPaginatedResponse
)
from schema.listening_core.room_config import RoomConfigRead, RoomConfigUpdate
from schema.token import TokenData
from schema.base import BaseResponse
from service.auth_service import decode_jwt_token
from service.listening_core.room_service import RoomService
from service.listening_core.game_service import GameService
from sqlmodel import Session
from utils.db import get_session
from utils.errors import APIException, raise_http_exception
from utils.listening_game_constants import DEFAULT_TEAM_SIZE, DEFAULT_TEAMS_COUNT

router = APIRouter()

room_service = RoomService()
game_service = GameService()


@router.get(
    "",
    summary="List all rooms owned by the authenticated user",
    response_model=RoomPaginatedResponse,
)
def list_rooms(
    offset: int = Query(0, ge=0, description="Number of items to skip"),
    limit: int = Query(10, le=100, description="Maximum number of items to retrieve (max 100)"),
    token_data: TokenData = Depends(decode_jwt_token),
    session: Session = Depends(get_session)
):
    try:
        room_summaries, total_count = room_service.list_rooms(
            token_data.user_id, offset, limit, session
        )
        
        return RoomPaginatedResponse(
            message="Rooms retrieved successfully",
            data=room_summaries,
            total=total_count,
            offset=offset,
            limit=limit
        )
    
    except APIException as exc:
        raise_http_exception(exc)


@router.post(
    "",
    summary="Create a new listening game room with configuration",
    response_model=RoomResponse[RoomRead],
    status_code=status.HTTP_201_CREATED,
)
def create_room(
    room_data: RoomCreate,
    token_data: TokenData = Depends(decode_jwt_token),
    session: Session = Depends(get_session)
):
    """
    Create a new listening game room with optional configuration.
    
    The room is created with its configuration in a single transaction.
    If no config is provided, default values are used.
    """
    try:
        created_room = room_service.create_room_with_config(
            room_data, token_data.user_id, session
        )
        
        team_size = room_data.config.team_size if room_data.config else DEFAULT_TEAM_SIZE
        max_players = team_size * DEFAULT_TEAMS_COUNT
        
        room_read = RoomRead(
            id=created_room.id,
            name=created_room.name,
            status=created_room.status,
            created_at=created_room.created_at,
            started_at=created_room.started_at,
            finished_at=created_room.finished_at,
            max_players=max_players,
            players_count=0
        )
        
        return RoomResponse(
            message="Room created successfully",
            data=room_read
        )
    
    except APIException as exc:
        raise_http_exception(exc)


@router.get(
    "/{room_id}",
    summary="Get room details with embedded config and team information",
    response_model=RoomResponse[RoomDetail],
)
def get_room(
    room_id: UUID,
    token_data: TokenData = Depends(decode_jwt_token),
    session: Session = Depends(get_session)
):
    """
    Retrieve detailed information about a room including:
    - Room basic information and status
    - Embedded room configuration
    - Team count and summary
    """
    try:
        room, config, team_summaries = room_service.get_room_detail(
            room_id, token_data.user_id, session
        )

        max_players = room_service._calculate_max_players(config)
        players_count = room_service.count_active_members(room_id, session)

        room_read = RoomRead(
            id=room.id,
            name=room.name,
            status=room.status,
            created_at=room.created_at,
            started_at=room.started_at,
            finished_at=room.finished_at,
            max_players=max_players,
            players_count=players_count
        )
        config_read = RoomConfigRead.model_validate(config)
        
        room_detail = RoomDetail(
            **room_read.model_dump(),
            config=config_read,
            teams=team_summaries
        )
        
        return RoomResponse(
            message="Room retrieved successfully",
            data=room_detail
        )
    
    except APIException as exc:
        raise_http_exception(exc)


@router.patch(
    "/{room_id}",
    summary="Update room name and/or status",
    response_model=RoomResponse[RoomRead],
)
def update_room(
    room_id: UUID,
    room_update: RoomUpdate,
    token_data: TokenData = Depends(decode_jwt_token),
    session: Session = Depends(get_session)
):
    """
    Update room properties. Both name and status can be modified.
    
    Status transitions:
    - lobby → active (when starting)
    - active → finished (when ending)
    - any → archived (when deleting)
    """
    try:
        updated_room = room_service.update_room(
            room_id, token_data.user_id, room_update.name, room_update.status, session
        )
        
        config = room_service.get_config(updated_room.id, session)
        max_players = room_service._calculate_max_players(config)
        players_count = room_service.count_active_members(room_id, session)

        room_read = RoomRead(
            id=updated_room.id,
            name=updated_room.name,
            status=updated_room.status,
            created_at=updated_room.created_at,
            started_at=updated_room.started_at,
            finished_at=updated_room.finished_at,
            max_players=max_players,
            players_count=players_count
        )
        
        return RoomResponse(
            message="Room updated successfully",
            data=room_read
        )
    
    except APIException as exc:
        raise_http_exception(exc)


@router.patch(
    "/{room_id}/config",
    summary="Partially update room configuration",
    response_model=BaseResponse[RoomConfigRead],
)
def update_room_config(
    room_id: UUID,
    config_update: RoomConfigUpdate,
    token_data: TokenData = Depends(decode_jwt_token),
    session: Session = Depends(get_session)
):
    """
    Update room configuration settings.
    
    Only provided fields will be updated. All fields are optional.
    Configuration can only be updated when room is in lobby status.
    """
    try:
        config_updates = config_update.model_dump(exclude_none=True)
        
        updated_config = room_service.update_room_config(
            room_id, token_data.user_id, config_updates, session
        )
        config_read = RoomConfigRead.model_validate(updated_config)
        
        return BaseResponse(
            message="Room configuration updated successfully",
            data=config_read
        )
    
    except APIException as exc:
        raise_http_exception(exc)


@router.delete(
    "/{room_id}",
    summary="Delete a room by ID"
)
def delete_room(
    room_id: UUID,
    token_data: TokenData = Depends(decode_jwt_token),
    session: Session = Depends(get_session)
):
    try:
        return room_service.delete_room(room_id, token_data.user_id, session)
    
    except APIException as exc:
        raise_http_exception(exc)