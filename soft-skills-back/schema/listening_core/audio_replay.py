from pydantic import BaseModel


class AudioReplayCounterResponse(BaseModel):
    """Response schema for incrementing replay counter."""
    request_accepted: bool
    can_replay_next: bool
    replays_used: int
    replays_left: int
    max_replays_per_round: int

    model_config = {"from_attributes": True}

