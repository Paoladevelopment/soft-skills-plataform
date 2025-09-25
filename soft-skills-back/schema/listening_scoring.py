from uuid import UUID
from sqlmodel import SQLModel

from utils.payloads_listening_game import ROUND_TEAM_SCORE_READ_EXAMPLE


class RoundTeamScoreRead(SQLModel):
    id: UUID
    round_team_id: UUID
    is_correct: bool
    base_points: int
    speed_bonus: int
    penalties: int
    total_points: int
    
    model_config = {
        "from_attributes": True,
        "json_schema_extra": {"example": ROUND_TEAM_SCORE_READ_EXAMPLE}
    }
