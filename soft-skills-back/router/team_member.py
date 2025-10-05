from uuid import UUID
from fastapi import APIRouter, Depends, status
from sqlmodel import Session

from schema.base import BaseResponse
from schema.token import TokenData
from service.auth_service import decode_jwt_token
from service.listening_core.team_member_service import TeamMemberService
from utils.db import get_session
from utils.errors import APIException, raise_http_exception

router = APIRouter()
team_member_service = TeamMemberService()

@router.post(
    "/rooms/{room_id}/teams/{team_id}/join",
    response_model=BaseResponse[str],
    status_code=status.HTTP_200_OK,
    summary="Join a team manually within a room (if room is in manual mode only)",
    response_description="Confirms team join operation",
)
def join_team(
    room_id: UUID,
    team_id: UUID,
    token_data: TokenData = Depends(decode_jwt_token),
    session: Session = Depends(get_session),
):
    try:
        team_member_service.join_team_manually(room_id, team_id, token_data.user_id, session)
        return BaseResponse(message="Joined team successfully.")
    except APIException as exc:
        raise_http_exception(exc)


@router.post(
    "/rooms/{room_id}/teams/{team_id}/leave",
    response_model=BaseResponse[str],
    status_code=status.HTTP_200_OK,
    summary="Leave a team manually within a room",
    response_description="Confirms team leave operation",
)
def leave_team(
    room_id: UUID,
    team_id: UUID,
    token_data: TokenData = Depends(decode_jwt_token),
    session: Session = Depends(get_session),
):
    try:
        removed_team_id = team_member_service.leave_team_manually(room_id, team_id, token_data.user_id, session)
        return BaseResponse(
            message=f"Left team {removed_team_id} successfully.",
            data=removed_team_id
        )
        
    except APIException as exc:
        raise_http_exception(exc)
