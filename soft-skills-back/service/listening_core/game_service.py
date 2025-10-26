from typing import Tuple, Sequence
from uuid import UUID
from datetime import datetime, timezone

from sqlmodel import Session, select, func
from model.listening_core.game_session import GameSession
from model.listening_core.game_session_config import GameSessionConfig
from schema.listening_core.game_session import GameSessionCreate, GameSessionSummary
from enums.listening_game import GameStatus
from utils.errors import APIException, Missing, BadRequest, Forbidden, handle_db_error


class GameService:
    """Service for managing single-player listening game sessions."""

    def get_game_session(self, session_id: UUID, session: Session) -> GameSession:
        """Get a game session by ID."""
        try:
            game_session = session.get(GameSession, session_id)

            if not game_session:
                raise Missing(f"Game session with ID {session_id} not found")

            return game_session
        
        except APIException as api_error:
            raise api_error

        except Exception as err:
            handle_db_error(err, "get_game_session", error_type="query")
    
    def get_config(self, session_id: UUID, session: Session) -> GameSessionConfig:
        """Get the configuration for a game session."""
        try:
            config = session.get(GameSessionConfig, session_id)

            if not config:
                raise Missing(f"Game session config for session {session_id} not found")

            return config
            
        except APIException as api_error:
            raise api_error
        
        except Exception as err:
            handle_db_error(err, "get_config", error_type="query")
    
    def verify_session_ownership(self, game_session: GameSession, user_id: UUID):
        """Verify that the user owns this game session."""
        if game_session.user_id != user_id:
            raise Forbidden("You are not allowed to perform this action")
    
    def create_game_session_with_config(
        self, 
        game_data: GameSessionCreate, 
        user_id: UUID, 
        session: Session
    ) -> GameSession:
        """Create a new game session with its configuration."""
        try:
            new_game_session = GameSession(
                name=game_data.name,
                user_id=user_id
            )
            
            session.add(new_game_session)
            session.flush()

            cfg_payload = (
                game_data.config.model_dump(exclude_none=True)
                if game_data.config else {}
            )
            
            game_session_config = GameSessionConfig(
                game_session_id=new_game_session.id,
                **cfg_payload
            )
            session.add(game_session_config)

            session.commit()
            session.refresh(new_game_session)
            
            return new_game_session
            
        except Exception as err:
            session.rollback()
            handle_db_error(err, "create_game_session_with_config", error_type="commit")
    
    def get_game_session_detail(
        self, 
        session_id: UUID, 
        user_id: UUID, 
        session: Session
    ) -> Tuple[GameSession, GameSessionConfig]:
        """Get detailed information about a game session including config."""
        try:
            game_session = self.get_game_session(session_id, session)
            self.verify_session_ownership(game_session, user_id)
            
            config = self.get_config(session_id, session)
            
            return game_session, config
            
        except APIException:
            raise
        except Exception as err:
            handle_db_error(err, "get_game_session_detail", error_type="query")
    
    def update_game_session(
        self, 
        session_id: UUID, 
        user_id: UUID, 
        name: str | None, 
        new_status: GameStatus | None, 
        session: Session
    ) -> GameSession:
        """Update game session properties like name and status."""
        try:
            game_session = self.get_game_session(session_id, session)
            self.verify_session_ownership(game_session, user_id)
            
            if name is not None:
                game_session.name = name
            
            if new_status is None or new_status == game_session.status:
                session.add(game_session)
                session.commit()
                session.refresh(game_session)

                return game_session
            
            current_status = game_session.status

            ALLOWED_STATUS_TRANSITIONS = {
                GameStatus.pending: {GameStatus.active, GameStatus.cancelled},
                GameStatus.active: {GameStatus.finished, GameStatus.cancelled},
                GameStatus.finished: set(),
                GameStatus.cancelled: set()
            }

            allowed_transitions = ALLOWED_STATUS_TRANSITIONS.get(current_status, set())
            if new_status not in allowed_transitions:
                raise BadRequest(f"Invalid status transition from {current_status} to {new_status}")

            game_session.status = new_status
            
            # Update timestamps based on status
            TIMESTAMP_FIELDS_BY_STATUS = {
                GameStatus.active: "started_at",
                GameStatus.finished: "finished_at",
                GameStatus.cancelled: "finished_at"
            }

            timestamp_field = TIMESTAMP_FIELDS_BY_STATUS.get(new_status)
            if timestamp_field:
                setattr(game_session, timestamp_field, datetime.now(timezone.utc))

            session.add(game_session)
            session.commit()
            session.refresh(game_session)
            
            return game_session
            
        except APIException:
            raise
        except Exception as err:
            session.rollback()
            handle_db_error(err, "update_game_session", error_type="commit")
    
    def update_game_session_config(
        self, 
        session_id: UUID, 
        user_id: UUID, 
        config_updates: dict, 
        session: Session
    ) -> GameSessionConfig:
        """Update game session configuration (only allowed before game starts)."""
        try:
            game_session = self.get_game_session(session_id, session)
            self.verify_session_ownership(game_session, user_id)
            
            if game_session.status != GameStatus.pending:
                raise BadRequest("Game session configuration can only be updated when status is pending")

            config = self.get_config(session_id, session)
            
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
            handle_db_error(err, "update_game_session_config", error_type="commit")
    
    def delete_game_session(self, session_id: UUID, user_id: UUID, session: Session) -> dict:
        """Delete a game session and return success message."""
        try:
            game_session = self.get_game_session(session_id, session)
            self.verify_session_ownership(game_session, user_id)
            
            session.delete(game_session)
            session.commit()

            return {
                "message": "Game session deleted successfully",
                "data": {"session_id": str(session_id)}
            }
        
        except APIException:
            raise
        except Exception as err:
            session.rollback()
            handle_db_error(err, "delete_game_session", error_type="commit")
    
    def _count_game_sessions(self, user_id: UUID, session: Session) -> int:
        """Count total game sessions for a user."""
        return session.scalar(
            select(func.count(GameSession.id))
            .where(GameSession.user_id == user_id)
        )
    
    def _get_game_sessions(
        self, 
        user_id: UUID, 
        offset: int, 
        limit: int, 
        session: Session
    ) -> Sequence[GameSession]:
        """Get paginated game sessions for a user."""
        return session.exec(
            select(GameSession)
            .where(GameSession.user_id == user_id)
            .order_by(GameSession.created_at.desc())
            .offset(offset)
            .limit(limit)
        ).all()
    
    def _get_game_sessions_paginated(
        self, 
        user_id: UUID, 
        offset: int, 
        limit: int, 
        session: Session
    ) -> Tuple[Sequence[GameSession], int]:
        """Get paginated game sessions with total count."""
        total_count = self._count_game_sessions(user_id, session)
        game_sessions = self._get_game_sessions(user_id, offset, limit, session)
        return game_sessions, total_count
    
    def list_game_sessions(
        self, 
        user_id: UUID, 
        offset: int, 
        limit: int, 
        session: Session
    ) -> Tuple[Sequence[GameSessionSummary], int]:
        """List all game sessions for a user with pagination."""
        try:
            game_sessions, total_count = self._get_game_sessions_paginated(
                user_id, offset, limit, session
            )
            
            game_session_summaries = [
                GameSessionSummary(
                    id=gs.id,
                    name=gs.name,
                    status=gs.status,
                    current_round=gs.current_round,
                    total_score=gs.total_score,
                    created_at=gs.created_at
                )
                for gs in game_sessions
            ]
            
            return game_session_summaries, total_count
            
        except APIException:
            raise
        except Exception as err:
            handle_db_error(err, "list_game_sessions", error_type="query")
