from typing import Tuple, Sequence, Optional, Dict, Any
from uuid import UUID
from datetime import datetime, timezone

from sqlmodel import Session, select, func
from model.listening_core.game_session import GameSession
from model.listening_core.game_session_config import GameSessionConfig
from model.listening_core.game_round import GameRound
from schema.listening_core.game_session import GameSessionCreate, GameSessionSummary
from enums.listening_game import GameStatus, GameRoundStatus, PlayMode
from utils.errors import APIException, Missing, BadRequest, Forbidden, Conflict, Locked, handle_db_error
from service.listening_core.game_round import GameRoundService


class GameSessionService:
    def __init__(self):
        self.game_round_service = GameRoundService()

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
    
    def get_game_session_for_update(self, session_id: UUID, session: Session) -> GameSession:
        """Get a game session by ID with FOR UPDATE lock for concurrency safety."""
        try:
            game_session = session.exec(
                select(GameSession)
                .where(GameSession.game_session_id == session_id)
                .with_for_update()
            ).first()

            if not game_session:
                raise Missing(f"Game session with ID {session_id} not found")

            return game_session
        
        except APIException as api_error:
            raise api_error

        except Exception as err:
            handle_db_error(err, "get_game_session_for_update", error_type="query")
    
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
    
    def submit_round_attempt(
        self,
        session_id: UUID,
        round_number: int,
        answer_payload: Dict[str, Any],
        idempotency_key: str,
        user_id: UUID,
        client_elapsed_ms: Optional[int],
        session: Session
    ):
        """
        Submit an attempt for a round with all validations.
        """
        try:
            game_session = self.get_game_session(session_id, session)
            self.verify_session_ownership(game_session, user_id)
            
            if game_session.status != GameStatus.in_progress:
                raise BadRequest(f"Game session must be in progress. Current status: {game_session.status}")
            
            return self.game_round_service.submit_attempt(
                game_session=game_session,
                round_number=round_number,
                answer_payload=answer_payload,
                idempotency_key=idempotency_key,
                user_id=user_id,
                client_elapsed_ms=client_elapsed_ms,
                db_session=session
            )
            
        except APIException:
            raise
        except Exception as err:
            session.rollback()
            handle_db_error(err, "submit_round_attempt", error_type="commit")
    
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
                game_session_id=new_game_session.game_session_id,
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
                session.commit()
                session.refresh(game_session)

                return game_session
            
            current_status = game_session.status

            ALLOWED_STATUS_TRANSITIONS = {
                GameStatus.pending: {GameStatus.in_progress, GameStatus.cancelled},
                GameStatus.in_progress: {GameStatus.paused, GameStatus.completed, GameStatus.cancelled},
                GameStatus.paused: {GameStatus.in_progress, GameStatus.cancelled},
                GameStatus.completed: set(),
                GameStatus.cancelled: set()
            }

            allowed_transitions = ALLOWED_STATUS_TRANSITIONS.get(current_status, set())
            if new_status not in allowed_transitions:
                raise BadRequest(f"Invalid status transition from {current_status} to {new_status}")

            game_session.status = new_status
            
            # Update timestamps based on status
            TIMESTAMP_FIELDS_BY_STATUS = {
                GameStatus.in_progress: "started_at",
                GameStatus.completed: "finished_at",
                GameStatus.cancelled: "finished_at"
            }

            timestamp_field = TIMESTAMP_FIELDS_BY_STATUS.get(new_status)
            if timestamp_field:
                setattr(game_session, timestamp_field, datetime.now(timezone.utc))

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
            select(func.count(GameSession.game_session_id))
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
                    game_session_id=gs.game_session_id,
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
    
    def start_game_session(
        self, 
        session_id: UUID, 
        user_id: UUID, 
        session: Session
    ) -> Tuple[GameSession, GameRound, bool]:
        """
        Activate a game session and ensure round 1 exists in queued state.
        Idempotent: returns current state if already active.
        
        Returns: (game_session, round_1, is_first_activation)
        Raises: 404 (not found), 403 (forbidden), 409 (terminal state).
        """
        try:
            game_session = self.get_game_session(session_id, session)
            self.verify_session_ownership(game_session, user_id)
            
            if game_session.status in (GameStatus.completed, GameStatus.cancelled):
                raise Conflict(f"Cannot start a session that is {game_session.status}")
            
            if game_session.status == GameStatus.in_progress:
                round_1 = self.game_round_service.get_or_create_round_queued(game_session, 1, session)
                
                return game_session, round_1, False
            
            game_session.status = GameStatus.in_progress
            game_session.started_at = datetime.now(timezone.utc)
            game_session.current_round = 1
            
            round_1 = self.game_round_service.get_or_create_round_queued(game_session, 1, session)
            
            session.commit()
            
            return game_session, round_1, True
            
        except APIException as api_error:
            raise api_error

        except Exception as err:
            session.rollback()
            handle_db_error(err, "start_game_session", error_type="commit")

    def get_current_round(
        self,
        game_session_id: UUID,
        user_id: UUID,
        session: Session
    ) -> Tuple[GameRound, Optional[Any], GameSessionConfig]:
        """
        Get and serve the current round of a game session.
        """
        try:
            game_session = self.get_game_session(game_session_id, session)
            self.verify_session_ownership(game_session, user_id)
            
            if game_session.status == GameStatus.paused:
                raise Locked("Game session is paused")
            
            if game_session.status in (GameStatus.completed, GameStatus.cancelled):
                raise Conflict(f"Cannot get current round for a session that is {game_session.status}")
            
            if game_session.status != GameStatus.in_progress:
                raise BadRequest("Game session must be in progress to get current round")
            
            config = self.get_config(game_session_id, session)
            
            game_round, challenge = self.game_round_service.get_and_serve_current_round(
                game_session, config, session
            )
            
            return game_round, challenge, config
            
        except APIException:
            raise
        except Exception as err:
            session.rollback()
            handle_db_error(err, "get_current_round", error_type="query")

    def _validate_session_for_advance(self, game_session: GameSession) -> None:
        """Validate that the game session is in a valid state to advance to the next round."""
        if game_session.status == GameStatus.paused:
            raise Locked("Game session is paused")
        
        if game_session.status in (GameStatus.completed, GameStatus.cancelled):
            raise Conflict(f"Cannot advance round for a session that is {game_session.status}")
        
        if game_session.status != GameStatus.in_progress:
            raise BadRequest(f"Game session must be in progress. Current status: {game_session.status}")

    def _complete_session(
        self,
        game_session: GameSession,
        session_id: UUID,
        db_session: Session
    ) -> Dict[str, Any]:
        """Mark session as completed and return completion response."""
        total_score = self.game_round_service.calculate_total_score(session_id, db_session)
        
        game_session.total_score = total_score
        game_session.status = GameStatus.completed
        game_session.finished_at = datetime.now(timezone.utc)
        
        db_session.commit()
        
        return {
            "session_completed": True,
            "final_score": total_score
        }

    def _advance_round_pointer(
        self,
        game_session: GameSession,
        db_session: Session
    ) -> Dict[str, Any]:
        """Advance the current_round pointer and return advancement response."""
        next_round = game_session.current_round + 1
        game_session.current_round = next_round
        
        db_session.commit()
        
        return {
            "current_round": next_round
        }

    def advance_to_next_round(
        self,
        session_id: UUID,
        user_id: UUID,
        db_session: Session
    ) -> Dict[str, Any]:
        """
        Advance the game session to the next round.
        """
        try:
            game_session = self.get_game_session_for_update(session_id, db_session)
            self.verify_session_ownership(game_session, user_id)
            
            self._validate_session_for_advance(game_session)

            current_round = self.game_round_service.get_round_for_update(
                game_session, 
                game_session.current_round, 
                db_session
            )
            
            if not current_round:
                raise Missing(f"Current round {game_session.current_round} not found for session {session_id}")
            
            if current_round.status != GameRoundStatus.attempted:
                raise Conflict("Current round must be attempted before advancing")
            
            config = self.get_config(session_id, db_session)
            
            if game_session.current_round >= config.total_rounds:
                return self._complete_session(game_session, session_id, db_session)
            
            return self._advance_round_pointer(game_session, db_session)
            
        except APIException:
            raise
        except Exception as err:
            db_session.rollback()
            handle_db_error(err, "advance_to_next_round", error_type="commit")

    def _filter_challenge_metadata_by_play_mode(
        self,
        challenge_metadata: Dict[str, Any],
        play_mode: Optional[PlayMode]
    ) -> Optional[Dict[str, Any]]:
        """
        Filter challenge metadata based on play_mode.
        
        - focus: returns 'question', 'answer_choices', and 'instruction'
        - cloze: returns 'text_with_blanks' and 'instruction'
        - other modes (paraphrase, summarize, clarify): returns 'instruction'
        """
        if not play_mode:
            return None
        
        instruction_map = {
            PlayMode.focus: "Listen to the audio and select the correct answer to the question.",
            PlayMode.cloze: "Listen to the audio and fill in the blanks in the text.",
            PlayMode.paraphrase: "Paraphrase the audio content in your own words.",
            PlayMode.summarize: "Summarize the main points of the audio content.",
            PlayMode.clarify: "Ask clarification questions about the audio content to better understand it."
        }
        
        instruction = instruction_map.get(play_mode)
        
        if play_mode == PlayMode.focus:
            if not challenge_metadata:
                return None
            filtered = {}
            if "question" in challenge_metadata:
                filtered["question"] = challenge_metadata["question"]
            if "answer_choices" in challenge_metadata:
                filtered["answer_choices"] = challenge_metadata["answer_choices"]
            if instruction:
                filtered["instruction"] = instruction
            return filtered if filtered else None
        
        elif play_mode == PlayMode.cloze:
            if not challenge_metadata:
                return None
            filtered = {}
            if "text_with_blanks" in challenge_metadata:
                filtered["text_with_blanks"] = challenge_metadata["text_with_blanks"]
            if instruction:
                filtered["instruction"] = instruction
            return filtered if filtered else None
        
        # For other modes (paraphrase, summarize, clarify)
        if instruction:
            return {"instruction": instruction}
        
        return None
