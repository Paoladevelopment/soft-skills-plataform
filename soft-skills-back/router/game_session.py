from uuid import UUID
from fastapi import APIRouter, Depends, Query, status

from schema.listening_core.game_session import (
    GameSessionCreate, 
    GameSessionRead, 
    GameSessionDetail, 
    GameSessionUpdate,
    GameSessionResponse, 
    GameSessionPaginatedResponse
)
from schema.listening_core.game_session_config import GameSessionConfigRead, GameSessionConfigUpdate
from schema.token import TokenData
from schema.base import BaseResponse
from service.auth_service import decode_jwt_token
from service.listening_core.game_service import GameService
from sqlmodel import Session
from utils.db import get_session
from utils.errors import APIException, raise_http_exception

router = APIRouter()

game_service = GameService()


@router.get(
    "",
    summary="List all game sessions owned by the authenticated user",
    response_model=GameSessionPaginatedResponse,
)
def list_game_sessions(
    offset: int = Query(0, ge=0, description="Number of items to skip"),
    limit: int = Query(10, le=100, description="Maximum number of items to retrieve (max 100)"),
    token_data: TokenData = Depends(decode_jwt_token),
    session: Session = Depends(get_session)
):
    try:
        game_session_summaries, total_count = game_service.list_game_sessions(
            token_data.user_id, offset, limit, session
        )
        
        return GameSessionPaginatedResponse(
            message="Game sessions retrieved successfully",
            data=game_session_summaries,
            total=total_count,
            offset=offset,
            limit=limit
        )
    
    except APIException as exc:
        raise_http_exception(exc)


@router.post(
    "",
    summary="Create a new single-player listening game session",
    response_model=GameSessionResponse[GameSessionRead],
    status_code=status.HTTP_201_CREATED,
)
def create_game_session(
    game_data: GameSessionCreate,
    token_data: TokenData = Depends(decode_jwt_token),
    session: Session = Depends(get_session)
):
    try:
        created_session = game_service.create_game_session_with_config(
            game_data, token_data.user_id, session
        )
        
        game_read = GameSessionRead.model_validate(created_session)
        
        return GameSessionResponse(
            message="Game session created successfully",
            data=game_read
        )
    
    except APIException as exc:
        raise_http_exception(exc)


@router.get(
    "/{session_id}",
    summary="Get game session details with embedded config",
    response_model=GameSessionResponse[GameSessionDetail],
)
def get_game_session(
    session_id: UUID,
    token_data: TokenData = Depends(decode_jwt_token),
    session: Session = Depends(get_session)
):
    try:
        game_session, config = game_service.get_game_session_detail(
            session_id, token_data.user_id, session
        )

        game_read = GameSessionRead.model_validate(game_session)
        
        config_read = GameSessionConfigRead.model_validate(config)
        
        game_detail = GameSessionDetail(
            **game_read.model_dump(),
            config=config_read
        )
        
        return GameSessionResponse(
            message="Game session retrieved successfully",
            data=game_detail
        )
    
    except APIException as exc:
        raise_http_exception(exc)


@router.patch(
    "/{session_id}",
    summary="Update game session name and/or status",
    response_model=GameSessionResponse[GameSessionRead],
)
def update_game_session(
    session_id: UUID,
    session_update: GameSessionUpdate,
    token_data: TokenData = Depends(decode_jwt_token),
    session: Session = Depends(get_session)
):
    try:
        updated_session = game_service.update_game_session(
            session_id, 
            token_data.user_id, 
            session_update.name, 
            session_update.status, 
            session
        )

        game_read = GameSessionRead.model_validate(updated_session)
        
        return GameSessionResponse(
            message="Game session updated successfully",
            data=game_read
        )
    
    except APIException as exc:
        raise_http_exception(exc)


@router.patch(
    "/{session_id}/config",
    summary="Partially update game session configuration",
    response_model=BaseResponse[GameSessionConfigRead],
)
def update_game_session_config(
    session_id: UUID,
    config_update: GameSessionConfigUpdate,
    token_data: TokenData = Depends(decode_jwt_token),
    session: Session = Depends(get_session)
):
    try:
        config_updates = config_update.model_dump(exclude_none=True)
        
        updated_config = game_service.update_game_session_config(
            session_id, token_data.user_id, config_updates, session
        )
        
        config_read = GameSessionConfigRead.model_validate(updated_config)
        
        return BaseResponse(
            message="Game session configuration updated successfully",
            data=config_read
        )
    
    except APIException as exc:
        raise_http_exception(exc)


@router.delete(
    "/{session_id}",
    summary="Delete a game session by ID",
    response_model=BaseResponse
)
def delete_game_session(
    session_id: UUID,
    token_data: TokenData = Depends(decode_jwt_token),
    session: Session = Depends(get_session)
):
    try:
        return game_service.delete_game_session(session_id, token_data.user_id, session)
    
    except APIException as exc:
        raise_http_exception(exc)

