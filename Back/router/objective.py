from fastapi import APIRouter, Depends, Query, status
from sqlmodel import Session

from schema.objective import (ObjectiveCreate, ObjectiveRead,
                              ObjectiveResponse, ObjectiveUpdate)
from schema.token import TokenData
from service.auth_service import decode_jwt_token
from service.objective import ObjectiveService
from utils.db import get_session
from utils.errors import APIException, raise_http_exception

router = APIRouter()

objective_service = ObjectiveService()

@router.post(
	"",
	response_model=ObjectiveResponse,
	summary="Create a learning goal objective",
	status_code=status.HTTP_201_CREATED,
)
def create_objective(
    objective: ObjectiveCreate,
    _: TokenData = Depends(decode_jwt_token),
    session: Session = Depends(get_session)
):
    try:
        created_objective = objective_service.create_objective(objective, session)
        objective_data = ObjectiveRead.model_validate(created_objective)

        return ObjectiveResponse(
            message="Objective created successfully",
            data=objective_data
        )

    except APIException as exc:
        raise_http_exception(exc)


@router.get(
    "/{id}", 
    summary="Retrieve an objective by ID", 
    response_model=ObjectiveResponse)
def get_objective(
    id: str, 
    _: TokenData = Depends(decode_jwt_token),
    session: Session = Depends(get_session)
):
    try:
        objective = objective_service.get_objective(id, session)
        objective_data = ObjectiveRead.model_validate(objective)

        return ObjectiveResponse(
            message="Objective retrieved successfully",
            data=objective_data
        )
    
    except APIException as exc:
        raise_http_exception(exc)


@router.patch(
    "{id}",
    summary="Update objective details by ID", 
    response_model=ObjectiveResponse
)
def update_learning_goal(
    id: str,
    objective: ObjectiveUpdate,
    token_data: TokenData = Depends(decode_jwt_token),
    session: Session = Depends(get_session),
):
    try:
        updated_objective = objective_service.update_objective(id, objective, token_data.user_id, session)
        objective_data = ObjectiveRead.model_validate(updated_objective)

        return ObjectiveResponse(
            message="Objective updated successfully",
            data=objective_data
        )

    except APIException as exc:
        raise_http_exception(exc)

@router.delete(
    "/{id}",
    summary="Delete a objective by ID"
)
def delete_objective(
    id: str,
    token_data: TokenData = Depends(decode_jwt_token),
    session: Session = Depends(get_session),
):
    try:
        return objective_service.delete_objective(id, token_data.user_id, session)
    
    except APIException as exc:
        raise_http_exception(exc)