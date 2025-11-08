from typing import Tuple, Sequence, Optional, Dict, Any
from uuid import UUID
from datetime import datetime, timezone

from sqlmodel import Session, select, func
from model.listening_core.game_session import GameSession
from model.listening_core.game_session_config import GameSessionConfig
from model.listening_core.game_round import GameRound
from model.listening_core.round_submission import RoundSubmission
from schema.listening_core.game_session import GameSessionCreate, GameSessionSummary
from schema.listening_core.game_round import RoundEvaluationResponse
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
    ) -> Tuple[GameRound, Optional[Any], GameSessionConfig, GameSession]:
        """
        Get and serve the current round of a game session.
        
        Returns:
            Tuple of (GameRound, Challenge, GameSessionConfig, GameSession)
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
            
            return game_round, challenge, config, game_session
            
        except APIException:
            raise
        except Exception as err:
            session.rollback()
            handle_db_error(err, "get_current_round", error_type="query")

    def get_round_by_number(
        self,
        game_session_id: UUID,
        round_number: int,
        user_id: UUID,
        session: Session
    ) -> Tuple[GameRound, Optional[Any], GameSessionConfig, GameSession]:
        """
        Get a round by round number for a game session.
        """
        try:
            game_session = self.get_game_session(game_session_id, session)
            self.verify_session_ownership(game_session, user_id)
            
            config = self.get_config(game_session_id, session)
            
            if round_number < 1 or round_number > config.total_rounds:
                raise BadRequest(
                    f"Round number must be between 1 and {config.total_rounds}. "
                    f"Provided: {round_number}"
                )
            
            game_round, challenge = self.game_round_service.get_round_by_number(
                game_session, round_number, session
            )
            
            return game_round, challenge, config, game_session
            
        except APIException:
            raise
        except Exception as err:
            session.rollback()
            handle_db_error(err, "get_round_by_number", error_type="query")

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
                raise Conflict(
                    f"Session is already at the last round ({config.total_rounds}). "
                    f"Use the /finish endpoint to complete the session."
                )
            
            return self._advance_round_pointer(game_session, db_session)
            
        except APIException:
            raise
        except Exception as err:
            db_session.rollback()
            handle_db_error(err, "advance_to_next_round", error_type="commit")

    def finish_session(
        self,
        session_id: UUID,
        user_id: UUID,
        db_session: Session
    ) -> Dict[str, Any]:
        """
        Finish a game session by marking it as completed.
        Returns idempotent result if already completed.
        """
        try:
            game_session = self.get_game_session_for_update(session_id, db_session)
            self.verify_session_ownership(game_session, user_id)
            
            if game_session.status == GameStatus.completed:
                return self._build_completion_response(game_session, session_id, db_session)
            
            config = self.get_config(session_id, db_session)
            
            if game_session.current_round != config.total_rounds:
                raise Conflict(
                    f"Session must be on the last round ({config.total_rounds}) to finish. "
                    f"Current round: {game_session.current_round}"
                )
            
            self._validate_last_round_for_finish(game_session, session_id, db_session)
            
            return self._complete_session(game_session, session_id, db_session)
            
        except APIException:
            raise
        except Exception as err:
            db_session.rollback()
            handle_db_error(err, "finish_session", error_type="commit")
    
    def get_completion_result(
        self,
        session_id: UUID,
        user_id: UUID,
        db_session: Session
    ) -> Dict[str, Any]:
        """
        Get completion result for a finished game session.
        """
        try:
            game_session = self.get_game_session(session_id, db_session)
            self.verify_session_ownership(game_session, user_id)
            
            if game_session.status != GameStatus.completed:
                raise Conflict("Session is not completed yet")
            
            return self._build_completion_response(game_session, session_id, db_session)
            
        except APIException:
            raise
        except Exception as err:
            handle_db_error(err, "get_completion_result", error_type="query")
    
    def _build_replay_response(
        self,
        replays_used: int,
        max_replays_per_round: int
    ) -> Dict[str, Any]:
        """Build replay response dictionary."""
        replays_left = max(0, max_replays_per_round - replays_used)
        allowed = replays_used < max_replays_per_round
        
        return {
            "allowed": allowed,
            "replays_used": replays_used,
            "replays_left": replays_left,
            "max_replays_per_round": max_replays_per_round
        }
    
    def _increment_and_return_replay_response(
        self,
        game_round: GameRound,
        max_replays_per_round: int,
        db_session: Session
    ) -> Dict[str, Any]:
        """Increment replay counter, commit, and return response."""
        game_round.replays_used = (game_round.replays_used or 0) + 1
        db_session.commit()
        
        return self._build_replay_response(game_round.replays_used, max_replays_per_round)
    
    def increment_replay(
        self,
        session_id: UUID,
        round_number: int,
        user_id: UUID,
        db_session: Session
    ) -> Dict[str, Any]:
        """
        Increment replay counter if under limit.
        """
        try:
            game_session = self.get_game_session(session_id, db_session)
            self.verify_session_ownership(game_session, user_id)
            
            if game_session.status == GameStatus.completed:
                raise Conflict("Cannot replay audio for a completed session")
            
            game_round = self.game_round_service.get_round_for_update(
                game_session, round_number, db_session
            )
            
            if not game_round:
                raise Missing(f"Round {round_number} not found for session {session_id}")
            
            config = self.get_config(session_id, db_session)
            
            if game_round.status not in (GameRoundStatus.served, GameRoundStatus.attempted):
                raise Conflict(f"Replay not allowed for round with status {game_round.status}")
            
            max_replays = config.max_replays_per_round
            replays_used = game_round.replays_used or 0
            
            if replays_used >= max_replays:
                return self._build_replay_response(replays_used, max_replays)
            
            return self._increment_and_return_replay_response(game_round, max_replays, db_session)
            
        except APIException:
            raise
        except Exception as err:
            db_session.rollback()
            handle_db_error(err, "increment_replay", error_type="commit")
    
    def can_replay(
        self,
        session_id: UUID,
        round_number: int,
        user_id: UUID,
        db_session: Session
    ) -> Dict[str, Any]:
        """
        Check if audio replay is allowed for a round.
        Read-only operation.
        """
        try:
            game_session = self.get_game_session(session_id, db_session)
            self.verify_session_ownership(game_session, user_id)
            
            if game_session.status == GameStatus.completed:
                raise Conflict("Cannot replay audio for a completed session")
            
            game_round = self.game_round_service._get_existing_round(
                game_session, round_number, use_for_update=False, session=db_session
            )
            
            if not game_round:
                raise Missing(f"Round {round_number} not found for session {session_id}")
            
            config = self.get_config(session_id, db_session)
            max_replays = config.max_replays_per_round
            replays_used = game_round.replays_used or 0
            
            return self._build_replay_response(replays_used, max_replays)
            
        except APIException:
            raise
        except Exception as err:
            handle_db_error(err, "can_replay", error_type="query")
    
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
    
    def _validate_session_for_advance(self, game_session: GameSession) -> None:
        """Validate that the game session is in a valid state to advance to the next round."""
        if game_session.status == GameStatus.paused:
            raise Locked("Game session is paused")
        
        if game_session.status in (GameStatus.completed, GameStatus.cancelled):
            raise Conflict(f"Cannot advance round for a session that is {game_session.status}")
        
        if game_session.status != GameStatus.in_progress:
            raise BadRequest(f"Game session must be in progress. Current status: {game_session.status}")

    def _validate_last_round_for_finish(
        self,
        game_session: GameSession,
        session_id: UUID,
        db_session: Session
    ) -> GameRound:
        """
        Validate that the last round exists and is attempted.
        """
        last_round = self.game_round_service.get_round_for_update(
            game_session,
            game_session.current_round,
            db_session
        )
        
        if not last_round:
            raise Missing(f"Last round {game_session.current_round} not found for session {session_id}")
        
        if last_round.status != GameRoundStatus.attempted:
            raise Conflict(
                f"Last round must be attempted before finishing session. "
                f"Current status: {last_round.status}"
            )
        
        return last_round

    def _build_completion_response(
        self,
        game_session: GameSession,
        session_id: UUID,
        db_session: Session
    ) -> Dict[str, Any]:
        """Build completion response with scores and timestamps."""
        total_score = self.game_round_service.calculate_total_score(session_id, db_session)
        total_max_score = self.game_round_service.calculate_total_max_score(session_id, db_session)
        
        return {
            "session_completed": True,
            "final_score": total_score,
            "final_max_score": total_max_score,
            "started_at": game_session.started_at,
            "finished_at": game_session.finished_at
        }

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
        
        return self._build_completion_response(game_session, session_id, db_session)

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
    
    def _extract_correct_answer(
        self,
        play_mode: PlayMode,
        challenge_metadata: Dict[str, Any]
    ) -> Any:
        """
        Extract the correct answer from challenge metadata based on play_mode.
        
        Returns:
            - paraphrase: reference_text (str)
            - focus: correct_answer (str)
            - cloze: answers (list[str])
            - summarize: reference_summary (str)
            - clarify: possible_questions (list[str])
        """
        if not challenge_metadata:
            return None
        
        if play_mode == PlayMode.paraphrase:
            return challenge_metadata.get("reference_text")
        elif play_mode == PlayMode.focus:
            return challenge_metadata.get("correct_answer")
        elif play_mode == PlayMode.cloze:
            return challenge_metadata.get("answers")
        elif play_mode == PlayMode.summarize:
            return challenge_metadata.get("reference_summary")
        elif play_mode == PlayMode.clarify:
            return challenge_metadata.get("possible_questions")

    def get_round_evaluation(
        self,
        game_round_id: UUID,
        challenge_metadata: Dict[str, Any],
        play_mode: Optional[PlayMode],
        session: Session
    ) -> Optional[RoundEvaluationResponse]:
        """
        Get evaluation data for a round that has been attempted.
        """
        if not play_mode:
            return None
        
        submission = session.exec(
            select(RoundSubmission).where(
                RoundSubmission.game_round_id == game_round_id
            )
        ).first()
        
        if not submission:
            return None
        
        correct_answer = self._extract_correct_answer(play_mode, challenge_metadata)
        
        return RoundEvaluationResponse(
            round_submission_id=submission.round_submission_id,
            is_correct=submission.is_correct,
            feedback_short=submission.feedback_short,
            answer_payload=submission.answer_payload or {},
            correct_answer=correct_answer
        )

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
