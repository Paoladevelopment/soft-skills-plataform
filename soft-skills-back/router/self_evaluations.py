from fastapi import APIRouter, Depends, Query, status
from uuid import UUID
from typing import Optional

from schema.self_evaluation import (
    SelfEvaluationCreate,
    SelfEvaluationCreated,
    SelfEvaluationCreatedResponse,
    SelfEvaluationRead,
    SelfEvaluationResponse
)
from schema.token import TokenData
from service.auth_service import decode_jwt_token
from service.self_evaluation import SelfEvaluationService
from sqlmodel import Session
from utils.db import get_session
from utils.errors import APIException, raise_http_exception, validate_uuid
from schema.base import PaginatedResponse


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
        evaluation = self_evaluation_service.get_evaluation_by_id(
            eval_uuid,
            session
        )
        evaluation_data = SelfEvaluationRead.model_validate(evaluation)
        
        return SelfEvaluationResponse(
            message="Self-evaluation retrieved successfully",
            data=evaluation_data
        )
    
    except APIException as err:
        raise_http_exception(err)


@router.get(
    "/by-user/{user_id}",
    response_model=PaginatedResponse[SelfEvaluationRead],
    summary="Get self-evaluations by user"
)
def get_evaluations_by_user(
    user_id: str,
    limit: int = Query(50, ge=1, le=100, description="Maximum number of items to retrieve"),
    offset: int = Query(0, ge=0, description="Number of items to skip"),
    _: TokenData = Depends(decode_jwt_token),
    session: Session = Depends(get_session)
):
    """Get all self-evaluations for a specific user."""
    try:
        user_uuid = validate_uuid(user_id, "user ID")
        
        evaluations, total = self_evaluation_service.get_evaluations_by_user(
            user_uuid,
            session,
            limit=limit,
            offset=offset
        )
        
        evaluation_data = [SelfEvaluationRead.model_validate(eval) for eval in evaluations]
        
        return PaginatedResponse[SelfEvaluationRead](
            data=evaluation_data,
            total=total,
            limit=limit,
            offset=offset
        )
    
    except APIException as err:
        raise_http_exception(err)


@router.get(
    "/by-task/{task_id}",
    response_model=PaginatedResponse[SelfEvaluationRead],
    summary="Get self-evaluations by task"
)
def get_evaluations_by_task(
    task_id: str,
    limit: int = Query(50, ge=1, le=100, description="Maximum number of items to retrieve"),
    offset: int = Query(0, ge=0, description="Number of items to skip"),
    _: TokenData = Depends(decode_jwt_token),
    session: Session = Depends(get_session)
):
    """Get all self-evaluations for a specific task."""
    try:
        task_uuid = validate_uuid(task_id, "task ID")
        
        evaluations, total = self_evaluation_service.get_evaluations_by_task(
            task_uuid,
            session,
            limit=limit,
            offset=offset
        )
        
        evaluation_data = [SelfEvaluationRead.model_validate(eval) for eval in evaluations]
        
        return PaginatedResponse[SelfEvaluationRead](
            data=evaluation_data,
            total=total,
            limit=limit,
            offset=offset
        )
    
    except APIException as err:
        raise_http_exception(err)

