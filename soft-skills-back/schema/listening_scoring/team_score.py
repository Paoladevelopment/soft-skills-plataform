from uuid import UUID

from model.listening_scoring import TeamScoreBase


class TeamScoreRead(TeamScoreBase):
    id: UUID
    game_id: UUID
    team_id: UUID
    
    model_config = {"from_attributes": True}
