from model.listening_core import RoomConfigBase
from utils.payloads_listening_game import ROOM_CREATE_EXAMPLE


class RoomConfigCreate(RoomConfigBase):
    model_config = {"json_schema_extra": {"example": ROOM_CREATE_EXAMPLE}}


class RoomConfigRead(RoomConfigBase):
    model_config = {"from_attributes": True}
