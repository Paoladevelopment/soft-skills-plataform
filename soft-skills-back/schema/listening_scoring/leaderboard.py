from typing import List
from uuid import UUID
from sqlmodel import SQLModel

from utils.payloads_listening_game import LEADERBOARD_READ_EXAMPLE


class TeamLeaderboardEntry(SQLModel):
    team_id: UUID
    team_name: str
    points_total: int
    rank: int


class LeaderboardRead(SQLModel):
    game_id: UUID
    teams: List[TeamLeaderboardEntry]
    
    model_config = {"json_schema_extra": {"example": LEADERBOARD_READ_EXAMPLE}}
