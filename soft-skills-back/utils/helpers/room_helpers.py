from uuid import UUID
from sqlmodel import Session, select, exists
from model.listening_core.room_member import RoomMember

def is_user_active_in_room(room_id: UUID, user_id: UUID, session: Session) -> bool:
    """
    Return True if the user is an active member of the given room.
    Used by both RoomMemberService and TeamMemberService.
    """
    return bool(session.scalar(
        select(exists().where(
            RoomMember.room_id == room_id,
            RoomMember.user_id == user_id,
            RoomMember.active == True,
        ))
    ))