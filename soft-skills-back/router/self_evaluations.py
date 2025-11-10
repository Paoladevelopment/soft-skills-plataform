from fastapi import APIRouter, Depends, Query, status
from uuid import UUID
from typing import Optional

from schema.self_evaluation import (
    SelfEvaluationCreate,
    SelfEvaluationCreated,
    SelfEvaluationCreatedResponse,
    SelfEvaluationListItem,
    SelfEvaluationListPaginatedResponse,
    SelfEvaluationRead,
    SelfEvaluationResponse
)
from schema.token import TokenData
from service.auth_service import decode_jwt_token
from service.self_evaluation import SelfEvaluationService
from enums.study_context import PerceivedDifficulty, Mood
from sqlmodel import Session
from utils.db import get_session
from utils.errors import APIException, BadRequest, raise_http_exception, validate_uuid


router = APIRouter()

self_evaluation_service = SelfEvaluationService()


@router.post(
    "",
    response_model=SelfEvaluationCreatedResponse,
    summary="Create self-evaluation",
    status_code=status.HTTP_201_CREATED,
)
def create_self_evaluation(
    evaluation: SelfEvaluationCreate,
    token_data: TokenData = Depends(decode_jwt_token),
    session: Session = Depends(get_session)
):
    """Create a new self-evaluation for a completed task."""
    try:
        created_evaluation = self_evaluation_service.create_evaluation(
            evaluation,
            token_data.user_id,
            session
        )
        evaluation_data = SelfEvaluationCreated.model_validate(created_evaluation)
        
        return SelfEvaluationCreatedResponse(
            message="Self-evaluation created successfully",
            data=evaluation_data
        )
    
    except APIException as err:
        raise_http_exception(err)


@router.get(
    "/{evaluation_id}",
    response_model=SelfEvaluationResponse,
    summary="Get self-evaluation by ID"
)
def get_self_evaluation(
    evaluation_id: str,
    _: TokenData = Depends(decode_jwt_token),
    session: Session = Depends(get_session)
):
    """Get a self-evaluation by its ID."""
    try:
        eval_uuid = validate_uuid(evaluation_id, "evaluation ID")
        evaluation_data = self_evaluation_service.get_evaluation_by_id(
            eval_uuid,
            session
        )
        
        return SelfEvaluationResponse(
            message="Self-evaluation retrieved successfully",
            data=evaluation_data
        )
    
    except APIException as err:
        raise_http_exception(err)


@router.get(
    "/by-user/{user_id}",
    response_model=SelfEvaluationListPaginatedResponse,
    summary="Get self-evaluations by user"
)
def get_evaluations_by_user(
    user_id: str,
    limit: int = Query(50, ge=1, le=100, description="Maximum number of items to retrieve"),
    offset: int = Query(0, ge=0, description="Number of items to skip"),
    difficulty: Optional[PerceivedDifficulty] = Query(None, description="Filter by perceived difficulty"),
    mood: Optional[Mood] = Query(None, description="Filter by mood"),
    sort_by: Optional[str] = Query(None, description="Sort by date: 'date_desc' or 'date_asc'"),
    _: TokenData = Depends(decode_jwt_token),
    session: Session = Depends(get_session)
):
    """Get all self-evaluations for a specific user with optional filtering and sorting."""
    try:
        user_uuid = validate_uuid(user_id, "user ID")
        
        if sort_by and sort_by not in ["date_desc", "date_asc"]:
            raise BadRequest("sort_by must be 'date_desc' or 'date_asc'")
        
        evaluations, total = self_evaluation_service.get_evaluations_by_user(
            user_uuid,
            session,
            limit=limit,
            offset=offset,
            difficulty=difficulty,
            mood=mood,
            sort_by=sort_by
        )
        
        return SelfEvaluationListPaginatedResponse(
            message="Self-evaluations retrieved successfully",
            data=evaluations,
            total=total,
            limit=limit,
            offset=offset
        )
    
    except APIException as err:
        raise_http_exception(err)

