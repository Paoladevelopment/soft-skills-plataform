from typing import Optional, Any
from uuid import UUID
from fastapi import APIRouter, BackgroundTasks, Depends, Query, status

from schema.listening_core.game_session import (
    GameSessionCreate, 
    GameSessionRead, 
    GameSessionDetail, 
    GameSessionUpdate,
    GameSessionResponse, 
    GameSessionPaginatedResponse,
    GameSessionStartResponse,
    AdvanceNextRoundResponse,
    RoundAdvanceResponse,
    SessionFinishResponse,
    SessionResultResponse,
)
from schema.listening_core.game_session_config import GameSessionConfigRead, GameSessionConfigUpdate
from schema.listening_core.game_round import (
    GameRoundReadSummary, 
    CurrentRoundResponse, 
    CurrentRoundConfig, 
)
from schema.listening_core.audio_replay import (
    AudioReplayCounterResponse
)
from enums.listening_game import GameRoundStatus
from schema.listening_core.round_submission import AttemptSubmissionRequest, AttemptSubmissionResponse
from schema.token import TokenData
from schema.base import BaseResponse
from service.auth_service import decode_jwt_token
from service.listening_core.game_session import GameSessionService
from service.listening_core.game_round_prefetch import safe_prefetch_rounds
from sqlmodel import Session
from utils.db import get_session
from utils.errors import APIException, raise_http_exception

router = APIRouter()

game_service = GameSessionService()


def _build_round_response(
    game_round: Any,
    challenge: Optional[Any],
    config: Any,
    game_session: Any,
    session: Session
) -> CurrentRoundResponse:
    """Build CurrentRoundResponse from round data."""
    config_minimal = CurrentRoundConfig.model_validate(config)
    audio_url = challenge.audio_url if challenge else None
    
    filtered_metadata = None
    if challenge and game_round.play_mode:
        filtered_metadata = game_service._filter_challenge_metadata_by_play_mode(
            challenge.challenge_metadata or {},
            game_round.play_mode
        )
    
    evaluation = None
    if game_round.status == GameRoundStatus.attempted:
        evaluation = game_service.get_round_evaluation(
            game_round.game_round_id,
            challenge.challenge_metadata or {} if challenge else {},
            game_round.play_mode,
            session
        )
    
    replays_used = game_round.replays_used or 0
    max_replays_per_round = config.max_replays_per_round
    replays_left = max(0, max_replays_per_round - replays_used)
    
    return CurrentRoundResponse(
        round_id=game_round.game_round_id,
        audio_url=audio_url,
        config=config_minimal,
        current_round=game_round.round_number,
        status=game_round.status,
        play_mode=game_round.play_mode,
        prompt_type=game_round.prompt_type,
        score=game_round.score,
        max_score=game_round.max_score,
        mode_payload=filtered_metadata,
        evaluation=evaluation,
        total_rounds=config.total_rounds,
        name=game_session.name,
        replays_used=replays_used,
        replays_left=replays_left,
        max_replays_per_round=max_replays_per_round
    )


@router.get(
    "",
    summary="Listar todas las sesiones de juego del usuario autenticado",
    response_model=GameSessionPaginatedResponse,
)
def list_game_sessions(
    offset: int = Query(0, ge=0, description="Número de elementos a omitir"),
    limit: int = Query(10, le=100, description="Número máximo de elementos a recuperar (máx. 100)"),
    token_data: TokenData = Depends(decode_jwt_token),
    session: Session = Depends(get_session)
):
    try:
        game_session_summaries, total_count = game_service.list_game_sessions(
            token_data.user_id, offset, limit, session
        )
        
        return GameSessionPaginatedResponse(
            message="Sesiones de juego obtenidas correctamente",
            data=game_session_summaries,
            total=total_count,
            offset=offset,
            limit=limit
        )
    
    except APIException as exc:
        raise_http_exception(exc)


@router.post(
    "",
    summary="Crear una nueva sesión de juego de escucha para un solo jugador",
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
            message="Sesión de juego creada correctamente",
            data=game_read
        )
    
    except APIException as exc:
        raise_http_exception(exc)


@router.post(
    "/{session_id}/start",
    summary="Iniciar una sesión de juego",
    response_model=GameSessionStartResponse,
)
def start_game_session(
    session_id: UUID,
    background_tasks: BackgroundTasks,
    token_data: TokenData = Depends(decode_jwt_token),
    session: Session = Depends(get_session)
):
    try:
        game_session, round_1, is_first_activation = game_service.start_game_session(session_id, token_data.user_id, session)
        
        if is_first_activation:
            background_tasks.add_task(safe_prefetch_rounds, session_id, [1, 2])
        
        round_summary = GameRoundReadSummary.model_validate(round_1)
        
        response_data = GameSessionStartResponse(
            session_id=game_session.game_session_id,
            status=game_session.status,
            current_round=game_session.current_round,
            started_at=game_session.started_at,
            round=round_summary
        )
        
        return response_data
    except APIException as exc:
        raise_http_exception(exc)


@router.get(
    "/{session_id}",
    summary="Obtener detalles de sesión de juego con configuración incluida",
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
            message="Sesión de juego obtenida correctamente",
            data=game_detail
        )
    
    except APIException as exc:
        raise_http_exception(exc)


@router.patch(
    "/{session_id}",
    summary="Actualizar nombre y/o estado de sesión de juego",
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
            message="Sesión de juego actualizada correctamente",
            data=game_read
        )
    
    except APIException as exc:
        raise_http_exception(exc)


@router.patch(
    "/{session_id}/config",
    summary="Actualizar parcialmente la configuración de sesión de juego",
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
            message="Configuración de sesión de juego actualizada correctamente",
            data=config_read
        )
    
    except APIException as exc:
        raise_http_exception(exc)


@router.delete(
    "/{session_id}",
    summary="Eliminar sesión de juego por ID",
    status_code=status.HTTP_200_OK
)
def delete_game_session(
    session_id: UUID,
    token_data: TokenData = Depends(decode_jwt_token),
    session: Session = Depends(get_session)
):
    try:
        result = game_service.delete_game_session(session_id, token_data.user_id, session)
        return result
    
    except APIException as exc:
        raise_http_exception(exc)


@router.get(
    "/{session_id}/rounds/current",
    summary="Obtener la ronda actual de una sesión de juego",
    response_model=BaseResponse[CurrentRoundResponse],
)
def get_current_round(
    session_id: UUID,
    background_tasks: BackgroundTasks,
    token_data: TokenData = Depends(decode_jwt_token),
    session: Session = Depends(get_session)
):
    try:
        game_round, challenge, config, game_session = game_service.get_current_round(
            game_session_id=session_id, user_id=token_data.user_id, session=session
        )
        
        current_round_number = game_round.round_number
        next_rounds = []
        if current_round_number + 1 <= config.total_rounds:
            next_rounds.append(current_round_number + 1)
        if current_round_number + 2 <= config.total_rounds:
            next_rounds.append(current_round_number + 2)
        
        if next_rounds:
            background_tasks.add_task(safe_prefetch_rounds, session_id, next_rounds)
        
        response_data = _build_round_response(game_round, challenge, config, game_session, session)
        
        return BaseResponse(
            message="Ronda actual obtenida correctamente",
            data=response_data
        )
    
    except APIException as exc:
        raise_http_exception(exc)


@router.get(
    "/{session_id}/rounds/{round_number}",
    summary="Obtener una ronda específica por número de ronda",
    response_model=BaseResponse[CurrentRoundResponse],
)
def get_round_by_number(
    session_id: UUID,
    round_number: int,
    token_data: TokenData = Depends(decode_jwt_token),
    session: Session = Depends(get_session)
):
    try:
        game_round, challenge, config, game_session = game_service.get_round_by_number(
            game_session_id=session_id,
            round_number=round_number,
            user_id=token_data.user_id,
            session=session
        )
        
        response_data = _build_round_response(game_round, challenge, config, game_session, session)
        
        return BaseResponse(
            message="Ronda obtenida correctamente",
            data=response_data
        )
    
    except APIException as exc:
        raise_http_exception(exc)


@router.post(
    "/{session_id}/rounds/next",
    summary="Avanzar a la siguiente ronda (estricto: solo después de intentar)",
    response_model=BaseResponse[AdvanceNextRoundResponse],
    status_code=status.HTTP_200_OK
)
def advance_to_next_round(
    session_id: UUID,
    token_data: TokenData = Depends(decode_jwt_token),
    session: Session = Depends(get_session)
):
    try:
        response_data = game_service.advance_to_next_round(
            session_id=session_id,
            user_id=token_data.user_id,
            db_session=session
        )
        
        validated_data = RoundAdvanceResponse.model_validate(response_data)
        
        return BaseResponse(
            message="Avanzado",
            data=validated_data
        )
    
    except APIException as exc:
        raise_http_exception(exc)


@router.post(
    "/{session_id}/rounds/{round_number}/attempt",
    summary="Enviar un intento para una ronda de juego",
    response_model=BaseResponse[AttemptSubmissionResponse],
    status_code=status.HTTP_200_OK
)
def submit_round_attempt(
    session_id: UUID,
    round_number: int,
    attempt_request: AttemptSubmissionRequest,
    token_data: TokenData = Depends(decode_jwt_token),
    session: Session = Depends(get_session)
):
    """
    Enviar un intento para la ronda especificada.
    """
    try:
        response = game_service.submit_round_attempt(
            session_id=session_id,
            round_number=round_number,
            answer_payload=attempt_request.answer_payload,
            idempotency_key=attempt_request.idempotency_key,
            user_id=token_data.user_id,
            client_elapsed_ms=attempt_request.client_elapsed_ms,
            session=session
        )
        
        return BaseResponse(
            message="Intento enviado correctamente",
            data=response
        )
    
    except APIException as exc:
        raise_http_exception(exc)


@router.post(
    "/{session_id}/finish",
    summary="Finalizar una sesión de juego",
    response_model=BaseResponse[SessionFinishResponse],
    status_code=status.HTTP_200_OK
)
def finish_game_session(
    session_id: UUID,
    token_data: TokenData = Depends(decode_jwt_token),
    session: Session = Depends(get_session)
):
    try:
        response_data = game_service.finish_session(
            session_id=session_id,
            user_id=token_data.user_id,
            db_session=session
        )
        
        validated_data = SessionFinishResponse.model_validate(response_data)
        
        return BaseResponse(
            message="Sesión de juego completada",
            data=validated_data
        )
    
    except APIException as exc:
        raise_http_exception(exc)


@router.get(
    "/{session_id}/result",
    summary="Obtener resultado de finalización de una sesión de juego terminada",
    response_model=BaseResponse[SessionResultResponse],
)
def get_game_session_result(
    session_id: UUID,
    token_data: TokenData = Depends(decode_jwt_token),
    session: Session = Depends(get_session)
):
    try:
        response_data = game_service.get_completion_result(
            session_id=session_id,
            user_id=token_data.user_id,
            db_session=session
        )
        
        validated_data = SessionResultResponse.model_validate(response_data)
        
        return BaseResponse(
            message="Resultado de sesión de juego obtenido correctamente",
            data=validated_data
        )
    
    except APIException as exc:
        raise_http_exception(exc)


@router.post(
    "/{session_id}/rounds/{round_number}/audio/replay",
    summary="Incrementar contador de repetición si está bajo el límite",
    response_model=BaseResponse[AudioReplayCounterResponse],
    status_code=status.HTTP_200_OK
)
def increment_audio_replay(
    session_id: UUID,
    round_number: int,
    token_data: TokenData = Depends(decode_jwt_token),
    session: Session = Depends(get_session)
):
    try:
        response_data = game_service.increment_replay(
            session_id=session_id,
            round_number=round_number,
            user_id=token_data.user_id,
            db_session=session
        )
        
        validated_data = AudioReplayCounterResponse.model_validate(response_data)
        
        return BaseResponse(
            message="Contador de repetición actualizado correctamente",
            data=validated_data
        )
    
    except APIException as exc:
        raise_http_exception(exc)


