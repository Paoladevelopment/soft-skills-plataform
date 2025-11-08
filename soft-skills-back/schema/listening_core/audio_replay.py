from pydantic import BaseModel


class AudioReplayCounterResponse(BaseModel):
    """Response schema for incrementing replay counter."""
    allowed: bool
    replays_used: int
    replays_left: int
    max_replays_per_round: int

    model_config = {"from_attributes": True}


class AudioReplayCheckResponse(BaseModel):
    """Response schema for checking if replay is allowed."""
    allowed: bool
    replays_used: int
    replays_left: int
    max_replays_per_round: int

    model_config = {"from_attributes": True}

