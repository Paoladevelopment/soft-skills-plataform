from uuid import UUID

from model.listening_game import VoiceRoomBase


class VoiceRoomRead(VoiceRoomBase):
    id: UUID
    round_team_id: UUID
    
    model_config = {"from_attributes": True}
