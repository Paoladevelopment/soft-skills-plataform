from typing import List, Optional, Tuple, Sequence
from uuid import UUID
from datetime import datetime, timezone

from sqlmodel import Session, select, func
from model.listening_core.room import Room
from model.listening_core.room_config import RoomConfig
from model.listening_core.room_member import RoomMember
from schema.listening_core.room import RoomCreate, RoomSummary, TeamSummary
from enums.listening_game import RoomStatus
from utils.errors import APIException, Missing, BadRequest, Forbidden, handle_db_error
from utils.listening_game_constants import DEFAULT_TEAMS_COUNT
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
    
    def verify_room_ownership(self, room: Room, user_id: UUID):
        if room.owner_user_id != user_id:
            raise Forbidden("You are not allowed to perform this action")
    
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
    
    def get_room_detail(self, room_id: UUID, user_id: UUID, session: Session) -> Tuple[Room, RoomConfig, List[TeamSummary]]:
        try:
            room = self.get_room(room_id, session)
            self.verify_room_ownership(room, user_id)
            
            config = self.get_config(room_id, session)
            team_summaries = self.team_service.get_team_summaries(room_id, session)
            
            return room, config, team_summaries
            
        except APIException:
            raise
        except Exception as err:
            handle_db_error(err, "get_room_detail", error_type="query")
    
    def update_room(self, room_id: UUID, user_id: UUID, name: Optional[str], new_status: Optional[RoomStatus], session: Session) -> Room:
        try:
            room = self.get_room(room_id, session)
            self.verify_room_ownership(room, user_id)
            
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
    
    def update_room_config(self, room_id: UUID, user_id: UUID, config_updates: dict, session: Session) -> RoomConfig:
        try:
            room = self.get_room(room_id, session)
            self.verify_room_ownership(room, user_id)
            
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
    
    def delete_room(self, room_id: UUID, user_id: UUID, session: Session):
        try:
            room = self.get_room(room_id, session)
            self.verify_room_ownership(room, user_id)
            
            session.delete(room)
            session.commit()

            return {"message": "Room deleted successfully", "room_id": room_id}
        
        except APIException:
            raise
        except Exception as err:
            session.rollback()
            handle_db_error(err, "delete_room", error_type="commit")
    
    def count_active_members(self, room_id: UUID, session: Session) -> int:
        try:
            return session.scalar(
                select(func.count())
                .select_from(RoomMember)
                .where(
                    RoomMember.room_id == room_id,
                    RoomMember.active == True
                )
            ) or 0
        
        except Exception as err:
            handle_db_error(err, "count_active_members", error_type="query")
    
    def _count_rooms(self, user_id: UUID, session: Session) -> int:
        return session.scalar(
            select(func.count(Room.id)).
            where(Room.owner_user_id == user_id)
        )
    
    def _get_rooms(self, user_id: UUID, offset: int, limit: int, session: Session) -> Sequence[Room]:
        return session.exec(
            select(Room)
            .where(Room.owner_user_id == user_id)
            .offset(offset)
            .limit(limit)
        ).all()
    
    def _get_rooms_paginated(self, user_id: UUID, offset: int, limit: int, session: Session) -> Tuple[Sequence[Room], int]:
        total_count = self._count_rooms(user_id, session)
        rooms = self._get_rooms(user_id, offset, limit, session)
        return rooms, total_count
    
    def _calculate_max_players(self, config: RoomConfig) -> int:
        return config.team_size * DEFAULT_TEAMS_COUNT
    
    def list_rooms(self, user_id: UUID, offset: int, limit: int, session: Session) -> Tuple[Sequence[RoomSummary], int]:
        try:
            rooms, total_count = self._get_rooms_paginated(user_id, offset, limit, session)
            
            room_summaries = []
            for room in rooms:
                config = self.get_config(room.id, session)
                max_players = self._calculate_max_players(config)
                players_count = self.count_active_members(room.id, session)
                
                room_summary = RoomSummary(
                    id=room.id,
                    name=room.name,
                    status=room.status,
                    created_at=room.created_at,
                    max_players=max_players,
                    players_count=players_count
                )
                
                room_summaries.append(room_summary)
            
            return room_summaries, total_count
            
        except APIException:
            raise
        except Exception as err:
            handle_db_error(err, "list_rooms", error_type="query")
