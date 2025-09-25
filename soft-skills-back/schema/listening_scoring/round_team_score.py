from uuid import UUID

from model.listening_scoring import RoundTeamScoreBase
from utils.payloads_listening_game import ROUND_TEAM_SCORE_READ_EXAMPLE


class RoundTeamScoreRead(RoundTeamScoreBase):
    id: UUID
    round_team_id: UUID
    
    model_config = {
        "from_attributes": True,
        "json_schema_extra": {"example": ROUND_TEAM_SCORE_READ_EXAMPLE}
    }
