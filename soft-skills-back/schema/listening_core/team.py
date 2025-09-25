from uuid import UUID

from model.listening_core import TeamBase


class TeamRead(TeamBase):
    id: UUID
    room_id: UUID
    
    model_config = {"from_attributes": True}
