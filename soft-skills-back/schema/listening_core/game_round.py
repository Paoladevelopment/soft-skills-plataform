from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import field_serializer

from model.listening_core.game_round import GameRoundBase
from utils.serializers import serialize_datetime_without_microseconds


class GameRoundReadSummary(GameRoundBase):
    game_round_id: UUID

    model_config = {"from_attributes": True}


class GameRoundRead(GameRoundBase):
    game_round_id: UUID
    challenge_id: Optional[UUID] = None
    prepared_at: Optional[datetime] = None
    started_at: Optional[datetime] = None
    ended_at: Optional[datetime] = None

    @field_serializer("prepared_at", "started_at", "ended_at", when_used="json")
    def serialize_datetime_fields(self, v: datetime | None) -> str | None:
        return serialize_datetime_without_microseconds(v)

    model_config = {"from_attributes": True}
