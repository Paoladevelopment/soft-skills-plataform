from typing import Optional
from uuid import UUID
from sqlmodel import SQLModel


class RoomJoinResult(SQLModel):
    """
    Result of joining a room with an invite token.
    Contains information about the join operation and team assignment.
    """
    room_id: UUID
    is_new_member: bool
    assignment_mode: str
    team_id: Optional[UUID] = None
    team_name: Optional[str] = None
    
    model_config = {"from_attributes": True}
