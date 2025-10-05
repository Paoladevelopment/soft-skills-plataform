from uuid import UUID
from fastapi import APIRouter, Depends, Query, status
from sqlmodel import Session

from schema.base import BaseResponse
from schema.listening_core.room_join import RoomJoinResult
from schema.token import TokenData
from service.auth_service import decode_jwt_token
from service.listening_core.rooom_member_service import RoomMemberService
from utils.db import get_session
from utils.errors import APIException, raise_http_exception

router = APIRouter()

room_member_service = RoomMemberService()

@router.post(
    "/{room_id}/join",
    response_model=BaseResponse[RoomJoinResult],
    status_code=status.HTTP_200_OK,
    summary="Join a room using an invite token",
    response_description="Join result with (optional) team assignment info."
)
def join_room(
    room_id: UUID,
    token: str = Query(..., description="Invite token provided in the URL"),
    token_data: TokenData = Depends(decode_jwt_token),
    session: Session = Depends(get_session),
):
    try:
        result = room_member_service.join_room_with_token(
            room_id=room_id,
            user_id=token_data.user_id,
            token=token,
            session=session,
        )

        return BaseResponse(
            message="Joined room", 
            data=result
        )
    except APIException as exc:
        raise_http_exception(exc)
