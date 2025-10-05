from typing import List, Optional, Tuple
from uuid import UUID
from datetime import datetime, timezone

from sqlmodel import Session
from model.listening_core.room import Room
from model.listening_core.room_config import RoomConfig
from schema.listening_core.room import RoomCreate, TeamSummary
from enums.listening_game import RoomStatus
from utils.errors import APIException, Missing, BadRequest, handle_db_error
from .team_service import TeamService


class RoomService:
    def __init__(self):
        self.team_service = TeamService()

    def get_room(self, room_id: UUID, session: Session) -> Room:
        try:
            room = session.get(Room, room_id)

            if not room:
                raise Missing(f"Room with ID {room_id} not found")

            return room
        
        except APIException as api_error:
            raise api_error

        except Exception as err:
            handle_db_error(err, "get_room", error_type="query")
    
    def get_config(self, room_id: UUID, session: Session) -> RoomConfig:
        try:
            config = session.get(RoomConfig, room_id)

            if not config:
                raise Missing(f"Room config for room {room_id} not found")

            return config
            
        except APIException as api_error:
            raise api_error
        
        except Exception as err:
            handle_db_error(err, "get_config", error_type="query")
    
    def create_room_with_config(self, room_data: RoomCreate, owner_user_id: UUID, session: Session) -> Room:
        try:
            new_room = Room(
                name=room_data.name,
                owner_user_id=owner_user_id
            )
            
            session.add(new_room)
            session.flush()
            
            cfg_payload = (
                room_data.config.model_dump(exclude_none=True)
                if room_data.config else {}
            )
            
            room_config = RoomConfig(
                room_id=new_room.id,
                **cfg_payload
            )
            session.add(room_config)

            self.team_service.create_default_teams(new_room.id, session)

            session.commit()
            session.refresh(new_room)
            
            return new_room
            
        except Exception as err:
            session.rollback()
            handle_db_error(err, "create_room_with_config", error_type="commit")
    
    def get_room_detail(self, room_id: UUID, session: Session) -> Tuple[Room, RoomConfig, List[TeamSummary]]:
        try:
            room = self.get_room(room_id, session)
            config = self.get_config(room_id, session)
            team_summaries = self.team_service.get_team_summaries(room_id, session)
            
            return room, config, team_summaries
            
        except APIException:
            raise
        except Exception as err:
            handle_db_error(err, "get_room_detail", error_type="query")
    
    def update_room(self, room_id: UUID, name: Optional[str], new_status: Optional[RoomStatus], session: Session) -> Room:
        try:
            room = self.get_room(room_id, session)
            
            if name is not None:
                room.name = name
            
            if new_status is None or new_status == room.status:
                return room
            
            current_status = room.status

            ALLOWED_STATUS_TRANSITIONS = {
                RoomStatus.lobby: {RoomStatus.active, RoomStatus.archived},
                RoomStatus.active: {RoomStatus.finished, RoomStatus.archived},
                RoomStatus.finished: {RoomStatus.archived},
                RoomStatus.archived: set()
            }

            allowed_transitions = ALLOWED_STATUS_TRANSITIONS.get(current_status, set())
            if new_status not in allowed_transitions:
                raise BadRequest(f"Invalid status transition from {current_status} to {new_status}")


            room.status = new_status
            
            TIMESTAMP_FIELDS_BY_STATUS = {
                RoomStatus.active: "started_at",
                RoomStatus.finished: "finished_at"
            }

            timestamp_field = TIMESTAMP_FIELDS_BY_STATUS.get(new_status)
            if timestamp_field:
                setattr(room, timestamp_field, datetime.now(timezone.utc))

            session.add(room)
            session.commit()
            session.refresh(room)
            
            return room
            
        except APIException:
            raise
        except Exception as err:
            session.rollback()
            handle_db_error(err, "update_room", error_type="commit")
    
    def update_room_config(self, room_id: UUID, config_updates: dict, session: Session) -> RoomConfig:
        try:
            room = self.get_room(room_id, session)
            if room.status != RoomStatus.lobby:
                raise BadRequest("Room configuration can only be updated when room is in lobby status")

            config = self.get_config(room_id, session)
            
            for field, value in config_updates.items():
                setattr(config, field, value)
            
            session.add(config)
            session.commit()
            session.refresh(config)
            
            return config
            
        except APIException:
            raise
        except Exception as err:
            session.rollback()
            handle_db_error(err, "update_room_config", error_type="commit")
