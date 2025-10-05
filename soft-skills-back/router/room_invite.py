from uuid import UUID
from fastapi import APIRouter, Depends, status
from sqlmodel import Session

from schema.token import TokenData
from schema.listening_core.room_invite import (
    RoomInviteCreate, RoomInviteRead, RoomInviteWithToken, RoomInviteResponse
)
from service.auth_service import decode_jwt_token
from service.listening_core.room_invite_service import RoomInviteService
from utils.db import get_session
from utils.errors import APIException, raise_http_exception

router = APIRouter()

invite_service = RoomInviteService()

@router.post(
    "/{room_id}/invites",
    response_model=RoomInviteResponse[RoomInviteWithToken],
    status_code=status.HTTP_201_CREATED,
    summary="Create an invite token for this room (owner only; token shown once)",
    response_description="Invite metadata plus the one-time clear token to embed in a shareable URL."
)
def create_invite_for_room(
    room_id: UUID,
    payload: RoomInviteCreate,
    token_data: TokenData = Depends(decode_jwt_token),
    session: Session = Depends(get_session),
):
    try:
        invite_out = invite_service.create_invite_for_room(room_id, token_data.user_id, payload, session)
        return RoomInviteResponse(
            message="Invite created", 
            data=invite_out
        )

    except APIException as exc:
        raise_http_exception(exc)

@router.get(
    "/{room_id}/invites",
    response_model=RoomInviteResponse[list[RoomInviteRead]],
    summary="List invites for a room (owner only)",
)
def list_room_invites(
    room_id: UUID,
    token_data: TokenData = Depends(decode_jwt_token),
    session: Session = Depends(get_session),
):
    try:
        items = invite_service.list_by_room(room_id, token_data.user_id, session, include_revoked=True)
        return RoomInviteResponse(
            message="Invites retrieved", 
            data=items
        )

    except APIException as exc:
        raise_http_exception(exc)

@router.post(
    "/{room_id}/invites/{invite_id}/revoke",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Revoke an invite (owner only)",
)
def revoke_invite(
    room_id: UUID,
    invite_id: UUID,
    token_data: TokenData = Depends(decode_jwt_token),
    session: Session = Depends(get_session),
):
    try:
        invite_service.revoke_invite(room_id, invite_id, token_data.user_id, session)
        return

    except APIException as exc:
        raise_http_exception(exc)
