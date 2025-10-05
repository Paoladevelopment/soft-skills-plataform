from uuid import UUID
from datetime import datetime, timezone
from typing import List, Optional
from sqlmodel import Session, select
from sqlalchemy import text

from model.listening_core import RoomInvite
from schema.listening_core.room_invite import RoomInviteCreate, RoomInviteRead, RoomInviteWithToken
from service.listening_core.room_service import RoomService
from utils.invites import generate_invite_token, hash_invite_token
from utils.errors import APIException, Missing, BadRequest, handle_db_error


class RoomInviteService:
    def __init__(self):
        self.room_service = RoomService()

    
    def get_invite(self, invite_id: UUID, session: Session) -> RoomInvite:
        try:
            invite = session.get(RoomInvite, invite_id)

            if not invite:
                raise Missing(f"Invite {invite_id} not found")

            return invite
        except APIException:
            raise

        except Exception as err:
            handle_db_error(err, "get_invite", error_type="query")
    
    def get_invites(
        self,
        room_id: UUID,
        session: Session,
        include_revoked: bool = False
    ) -> List[RoomInvite]:
        try:
            statement = select(RoomInvite).where(RoomInvite.room_id == room_id)

            if not include_revoked:
                statement = statement.where(RoomInvite.revoked == False)

            return session.exec(statement).all()

        except Exception as err:
            handle_db_error(err, "get_invites", error_type="query")
    
    def _get_active_invite_by_token_hash(
        self,
        room_id: UUID,
        token_hash: str,
        session: Session
    ) -> Optional[RoomInvite]:
        try:
            return session.exec(
                select(RoomInvite).where(
                    RoomInvite.room_id == room_id, 
                    RoomInvite.token_hash == token_hash, 
                    RoomInvite.revoked == False
                )
            ).first()

        except Exception as err:
            handle_db_error(err, "_get_active_invite_by_token_hash", error_type="query")

    def _assert_owner(self, session: Session, room_id: UUID, user_id: UUID):
        room = self.room_service.get_room(room_id, session) 

        if room.owner_user_id != user_id:
            raise BadRequest("Only the room owner can create an invite")

    def create_invite_for_room(
        self,
        room_id: UUID,
        created_by: UUID,
        payload: RoomInviteCreate,
        session: Session
    ) -> RoomInviteWithToken:
        try:
            self._assert_owner(session, room_id, created_by)

            token = generate_invite_token()
            token_hash = hash_invite_token(token)

            invite = RoomInvite(
                room_id=room_id,
                created_by=created_by,
                token_hash=token_hash,
                expires_at=payload.expires_at,
                max_uses=payload.max_uses,
            )

            session.add(invite)
            session.commit()
            session.refresh(invite)

            return RoomInviteWithToken(
                id=invite.id,
                room_id=invite.room_id,
                created_by=invite.created_by,
                created_at=invite.created_at,
                updated_at=invite.updated_at,
                expires_at=invite.expires_at,
                max_uses=invite.max_uses,
                uses=invite.uses,
                revoked=invite.revoked,
                token=token,
            )

        except APIException:
            raise

        except Exception as err:
            session.rollback()
            handle_db_error(err, "create_invite_for_room", error_type="commit")

    def list_by_room(
        self,
        room_id: UUID,
        requesting_user_id: UUID,
        session: Session,
        include_revoked: bool = True
    ) -> List[RoomInviteRead]:
        try:
            self._assert_owner(session, room_id, requesting_user_id)
            invites = self.get_invites(room_id, session, include_revoked=include_revoked)

            return [
                RoomInviteRead.model_validate(inv)
                for inv in invites
            ]

        except APIException:
            raise
        except Exception as err:
            handle_db_error(err, "list_by_room", error_type="query")

    def revoke_invite(
        self,
        room_id: UUID,
        invite_id: UUID,
        requesting_user_id: UUID,
        session: Session
    ) -> None:
        try:
            invite = self.get_invite(invite_id, session)

            if invite.room_id != room_id:
                raise Missing(f"Invite {invite_id} does not belong to this room")

            self._assert_owner(session, invite.room_id, requesting_user_id)

            if invite.revoked:
                return 

            invite.revoked = True
            session.add(invite)
            session.commit()

        except APIException:
            raise
        except Exception as err:
            session.rollback()
            handle_db_error(err, "revoke_invite", error_type="commit")

    def validate_invite_for_join(
        self,
        room_id: UUID,
        token: str,
        session: Session
    ) -> RoomInvite:
        try:
            if not token:
                raise BadRequest("Invite token is required")

            token_hash = hash_invite_token(token)
            invite = self._get_active_invite_by_token_hash(room_id, token_hash, session)

            if not invite:
                raise BadRequest("Invalid invite")

            now = datetime.now(timezone.utc)
            if invite.expires_at and now > invite.expires_at:
                raise BadRequest("Invite expired")

            if invite.max_uses is not None and invite.uses >= invite.max_uses:
                raise BadRequest("This invite has reached its maximum number of uses.")

            return invite

        except APIException:
            raise
        except Exception as err:
            handle_db_error(err, "validate_invite_for_join", error_type="query")

    def mark_used_atomically(self, invite_id: UUID, session: Session) -> int:
        """
            Atomically increment `uses` for the given invite.
            Fails if the invite is revoked, expired, or has hit max_uses.
            Returns the new `uses` value on success.
        """
        try:
            result = session.exec(
                text("""
                    UPDATE listening_room_invite
                    SET uses = uses + 1, updated_at = NOW()
                    WHERE id = :id
                      AND revoked = false
                      AND (expires_at IS NULL OR expires_at > NOW())
                      AND (max_uses IS NULL OR uses < max_uses)
                    RETURNING uses
                """),
                {"id": invite_id},
            )
            row = result.first()

            if row is None:
                raise BadRequest("Invite usage limit reached")

            return row[0]

        except APIException:
            raise
        except Exception as err:
            handle_db_error(err, "mark_used_atomic", error_type="query")
