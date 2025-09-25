from uuid import UUID

from model.listening_core import GameBase


class GameRead(GameBase):
    id: UUID
    room_id: UUID
    
    model_config = {"from_attributes": True}
