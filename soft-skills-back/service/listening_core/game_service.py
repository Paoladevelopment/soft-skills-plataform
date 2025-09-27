from typing import Tuple
from uuid import UUID
from datetime import datetime, timezone

from sqlmodel import Session, select
from model.listening_core.room import Room
from model.listening_core.game import Game
from model.listening_core.round import Round
from enums.listening_game import RoomStatus, GameStatus, RoundStatus
from utils.errors import APIException, Missing, BadRequest, handle_db_error


class GameService:
    pass
