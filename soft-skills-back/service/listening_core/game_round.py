from typing import Tuple, Sequence, Optional, Dict, Any, Type
from uuid import UUID
from datetime import datetime, timezone
import random
from collections import Counter

from pydantic import BaseModel, ValidationError
from sqlmodel import Session, select, func

from model.listening_core.game_session import GameSession
from model.listening_core.game_session_config import GameSessionConfig
from model.listening_core.game_round import GameRound
from model.listening_core.challenge import Challenge
from model.listening_core.round_submission import RoundSubmission
from enums.listening_game import GameRoundStatus, PlayMode, PromptType
from enums.common.language import Language
from schema.listening_core.challenge import GenerateChallenge
from schema.listening_core.round_submission import AttemptSubmissionResponse
from utils.errors import APIException, Missing, InternalError, BadRequest, Conflict, handle_db_error
from utils.listening_defaults import get_audio_length_for_difficulty
from service.challenge import ChallengeService
from service.listening_core.scoring import evaluate_submitted_answer
from schema.listening_core.scoring import (
    FocusAnswerPayload,
    ClozeAnswerPayload,
    ClarifyAnswerPayload,
    SummarizeAnswerPayload,
    ParaphraseAnswerPayload
)
from pydantic import ValidationError
from utils.scoring_errors import InvalidPayload


class GameRoundService:
    def __init__(self):
        self.challenge_service = ChallengeService()

    def _get_existing_round(self, game_session: GameSession, round_number: int, use_for_update: bool = False, session: Session = None) -> GameRound | None:
        """Query for existing round by session_id and round_number."""
        query = select(GameRound).where(
            (GameRound.game_session_id == game_session.game_session_id) &
            (GameRound.round_number == round_number)
        )
        
        if use_for_update:
            query = query.with_for_update(skip_locked=True)
        
        return session.exec(query).first()
    
    def get_round_for_update(self, game_session: GameSession, round_number: int, session: Session) -> GameRound | None:
        """Get a round by session and round number with FOR UPDATE lock."""
        return self._get_existing_round(game_session, round_number, use_for_update=True, session=session)
    
    def calculate_total_score(self, game_session_id: UUID, session: Session) -> float:
        """Calculate total score by summing all round scores for a game session."""
        total_score = session.scalar(
            select(func.coalesce(func.sum(GameRound.score), 0.0))
            .where(
                GameRound.game_session_id == game_session_id,
                GameRound.status == GameRoundStatus.attempted
            )
        ) or 0.0
        
        return total_score

    def _should_prepare_round(self, game_round: GameRound) -> bool:
        """Check if round needs preparation based on its current status."""
        return game_round.status == GameRoundStatus.queued

    def _get_previous_rounds(self, game_session: GameSession, current_round_number: int, db_session: Session) -> Sequence[GameRound]:
        """Get all rounds before the current one, ordered by round number."""
        return db_session.exec(
            select(GameRound)
            .where(
                (GameRound.game_session_id == game_session.game_session_id) &
                (GameRound.round_number < current_round_number)
            )
            .order_by(GameRound.round_number)
        ).all()

    def _is_invalid_combination(self, play_mode: PlayMode, prompt_type: PromptType) -> bool:
        """Check if a play mode and prompt type combination is invalid."""
        if play_mode == PlayMode.paraphrase and prompt_type == PromptType.dialogue:
            return True

        if play_mode == PlayMode.cloze and prompt_type == PromptType.dialogue:
            return True
            
        return False

    def _build_valid_combinations(self, config: GameSessionConfig) -> list[tuple[PlayMode, PromptType]]:
        """Build all valid mode and type combinations from config, excluding invalid ones."""
        all_combinations = [
            (mode, ptype) for mode in config.selected_modes for ptype in config.allowed_types
        ]

        valid_combinations = []
        for mode, ptype in all_combinations:
            if not self._is_invalid_combination(mode, ptype):
                valid_combinations.append((mode, ptype))
        
        return valid_combinations

    def _get_previous_combination(self, existing_rounds: Sequence[GameRound]) -> tuple[PlayMode, PromptType] | None:
        """Get the mode/type combination from the last round, if it exists."""
        if existing_rounds and existing_rounds[-1].play_mode and existing_rounds[-1].prompt_type:
            return (existing_rounds[-1].play_mode, existing_rounds[-1].prompt_type)
            
        return None

    def _get_least_frequent_combinations(
        self, 
        available_combinations: list[tuple[PlayMode, PromptType]], 
        existing_rounds: Sequence[GameRound]
    ) -> list[tuple[PlayMode, PromptType]]:
        """Get combinations with lowest usage frequency from existing rounds."""
        combination_counts = Counter(
            (r.play_mode, r.prompt_type) for r in existing_rounds 
            if r.play_mode and r.prompt_type
        )
        
        if not combination_counts:
            return available_combinations
        
        min_frequency = min(combination_counts.get(c, 0) for c in available_combinations)
        return [c for c in available_combinations if combination_counts.get(c, 0) == min_frequency]

    def _query_eligible_challenges(
        self,
        config: GameSessionConfig,
        play_mode: PlayMode,
        prompt_type: PromptType,
        db_session: Session
    ) -> list[Challenge]:
        """Query challenges matching difficulty, mode, and type."""
        return db_session.exec(
            select(Challenge)
            .where(
                (Challenge.difficulty == config.difficulty) &
                (Challenge.play_mode == play_mode) &
                (Challenge.prompt_type == prompt_type)
            )
            .limit(100)
        ).all()

    def _get_used_challenge_ids(self, existing_rounds: Sequence[GameRound]) -> set[UUID]:
        """Get set of challenge IDs already used in this session."""
        return set(r.challenge_id for r in existing_rounds if r.challenge_id is not None)

    def _select_from_eligible_challenges(self, challenges: list[Challenge]) -> Challenge | None:
        """Select a challenge from eligible list, preferring those with audio."""
        if not challenges:
            return None

        with_audio = [c for c in challenges if c.audio_url]
        return random.choice(with_audio) if with_audio else random.choice(challenges)

    def _try_reuse_existing_challenge(
        self,
        config: GameSessionConfig,
        play_mode: PlayMode,
        prompt_type: PromptType,
        used_challenge_ids: set[UUID],
        db_session: Session
    ) -> Challenge | None:
        """Try to find and select an existing eligible challenge, return None if none available."""
        existing_challenge = self._query_eligible_challenges(config, play_mode, prompt_type, db_session)

        available_challenges = [c for c in existing_challenge if c.challenge_id not in used_challenge_ids]
        
        return self._select_from_eligible_challenges(available_challenges)

    def _assign_challenge_to_round(
        self, 
        game_session: GameSession, 
        config: GameSessionConfig, 
        game_round: GameRound, 
        db_session: Session = None
    ) -> None:
        """Select challenge and mode for round, ensure audio exists, mark as ready."""
        existing_rounds = self._get_previous_rounds(game_session, game_round.round_number, db_session)
        
        play_mode, prompt_type = self.select_mode_and_type_with_diversity(
            config, 
            existing_rounds
        )
        
        game_round.play_mode = play_mode
        game_round.prompt_type = prompt_type
        
        challenge = self.select_or_generate_challenge(
            config, 
            play_mode, 
            prompt_type, 
            existing_rounds,
            db_session
        )
        
        game_round.challenge_id = challenge.challenge_id
        self._synthesize_audio_if_needed(challenge, db_session)
        
        game_round.prepared_at = datetime.now(timezone.utc)
        game_round.status = GameRoundStatus.pending
        
        db_session.add(game_round)

    def _synthesize_audio_if_needed(self, challenge: Challenge, db_session: Session) -> None:
        """Synthesize audio for challenge if not already available. Non-blocking on failure."""
        if not challenge.audio_url:
            try:
                self.challenge_service.get_or_create_audio(challenge.challenge_id, db_session)
            except Exception as err:
                pass

    def get_or_create_round_queued(
        self, 
        game_session: GameSession, 
        round_number: int, 
        session: Session
    ) -> GameRound:
        """Get existing round or create new one in queued state."""
        existing_round = self._get_existing_round(game_session, round_number, session=session)
        
        if existing_round:
            return existing_round
        
        new_round = GameRound(
            game_session_id=game_session.game_session_id,
            round_number=round_number,
            status=GameRoundStatus.queued
        )

        session.add(new_round)
        session.flush()
        
        return new_round
    
    def prepare_or_get_round(
        self, 
        round_number: int, 
        game_session: GameSession,
        config: GameSessionConfig,
        db_session: Session = None
    ) -> GameRound:
        """Prepare a round or return if already prepared. Idempotent with retry logic."""
        try:
            game_round = self._get_existing_round(game_session, round_number, use_for_update=True, session=db_session)
            
            if not game_round:
                game_round = GameRound(
                    game_session_id=game_session.game_session_id,
                    round_number=round_number,
                    status=GameRoundStatus.queued
                )
                
                db_session.add(game_round)
                db_session.flush()
            
            if not self._should_prepare_round(game_round):
                return game_round
            
            self._assign_challenge_to_round(
                game_session, 
                config, 
                game_round, 
                db_session
            )
            
            db_session.commit()
            db_session.refresh(game_round)
            
            return game_round
            
        except APIException as api_error:
            raise api_error
        except Exception as err:
            db_session.rollback()
            handle_db_error(err, "prepare_or_get_round", error_type="commit")

    def select_mode_and_type_with_diversity(
        self, 
        config: GameSessionConfig, 
        existing_rounds: Sequence[GameRound]
    ) -> Tuple[PlayMode, PromptType]:
        """Select game mode and prompt type with variety, avoiding immediate repetition."""
        valid_combinations = self._build_valid_combinations(config)
        
        if len(valid_combinations) == 1:
            return valid_combinations[0]
        
        previous_combination = self._get_previous_combination(existing_rounds)
        
        if previous_combination and previous_combination in valid_combinations:
            available_combinations = [c for c in valid_combinations if c != previous_combination]
        else:
            available_combinations = valid_combinations
        
        least_frequent = self._get_least_frequent_combinations(available_combinations, existing_rounds)
        
        return random.choice(least_frequent) if least_frequent else available_combinations[0]

    def select_or_generate_challenge(
        self, 
        config: GameSessionConfig, 
        play_mode: PlayMode, 
        prompt_type: PromptType, 
        existing_rounds: Sequence[GameRound],
        db_session: Session
    ) -> Challenge:
        """Select or generate challenge: if reuse enabled, query eligible unused; otherwise generate new."""
        used_challenge_ids = self._get_used_challenge_ids(existing_rounds)
        
        if config.reuse_existing_challenges:
            reused = self._try_reuse_existing_challenge(
                config, play_mode, prompt_type, used_challenge_ids, db_session
            )
            
            if reused:
                return reused
        
        audio_length = get_audio_length_for_difficulty(config.difficulty)
        
        generate_request = GenerateChallenge(
            play_mode=play_mode,
            prompt_type=prompt_type,
            difficulty=config.difficulty,
            audio_length=audio_length,
            locale=Language.SPANISH
        )
        
        try:
            challenge_read = self.challenge_service.generate_challenge(generate_request, db_session)
            challenge = self.challenge_service.get_challenge(challenge_read.challenge_id, db_session)
            
            return challenge
        except Exception as err:
            raise InternalError(f"Failed to generate challenge: {str(err)}")

    def mark_round_as_served(self, game_round: GameRound, db_session: Session) -> None:
        """Mark a round as served. Idempotent."""
        if game_round.status == GameRoundStatus.served:
            return
        
        game_round.status = GameRoundStatus.served
        if game_round.started_at is None:
            game_round.started_at = datetime.now(timezone.utc)

    def get_and_serve_current_round(
        self,
        game_session: GameSession,
        config: GameSessionConfig,
        db_session: Session
    ) -> Tuple[GameRound, Optional[Challenge]]:
        """
        Get and serve the current round of a game session.
        """
        current_round_number = game_session.current_round
        
        game_round = self.prepare_or_get_round(
            current_round_number,
            game_session,
            config,
            db_session=db_session
        )
        
        if game_round.status != GameRoundStatus.served:
            self.mark_round_as_served(game_round, db_session)
            db_session.commit()
            db_session.refresh(game_round)
        
        challenge = None
        if game_round.challenge_id:
            challenge = self.challenge_service.get_challenge(game_round.challenge_id, db_session)
        
        return game_round, challenge

    def _check_existing_submission(
        self,
        game_round: GameRound,
        idempotency_key: str,
        answer_payload: Dict[str, Any],
        db_session: Session
    ) -> Optional[RoundSubmission]:
        """
        Check for existing submission with same idempotency_key.
        
        Returns the existing submission if found and payload matches.
        Raises Conflict if found but payload differs.
        Returns None if not found.
        """
        existing_submission = db_session.exec(
            select(RoundSubmission)
            .where(
                (RoundSubmission.game_round_id == game_round.game_round_id) &
                (RoundSubmission.idempotency_key == idempotency_key)
            )
        ).first()
        
        if not existing_submission:
            return None
        
        existing_payload = existing_submission.answer_payload or {}
        
        if existing_payload != answer_payload:
            raise Conflict(
                "An attempt with this idempotency_key already exists with a different answer_payload"
            )
        
        return existing_submission

    def _build_payload_validation_error_message(
        self,
        play_mode: PlayMode,
        validation_error: ValidationError,
        schema_class: Type[BaseModel],
        answer_payload: Dict[str, Any]
    ) -> str:
        """
        Build a user-friendly error message from Pydantic validation errors.
        """
        errors = validation_error.errors()
        error_messages = []
        
        for error in errors:
            field = error.get('loc', ['unknown'])[-1] if error.get('loc') else 'unknown'
            error_type = error.get('type', 'validation_error')
            error_msg = error.get('msg', 'Invalid value')
            
            if error_type == 'missing':
                error_messages.append(f"Missing required field '{field}'")
            elif error_type == 'value_error':
                error_messages.append(f"Invalid value for field '{field}': {error_msg}")
            elif error_type == 'type_error':
                error_messages.append(f"Field '{field}' has wrong type: {error_msg}")
            else:
                error_messages.append(f"Field '{field}': {error_msg}")
        
        expected_fields = list(schema_class.model_fields.keys())
        provided_fields = list(answer_payload.keys()) if answer_payload else []

        error_detail = ". ".join(error_messages)
        message = (
            f"Invalid answer payload for {play_mode.value} mode. "
            f"{error_detail}. "
            f"Expected fields: {', '.join(expected_fields)}. "
            f"Provided fields: {', '.join(provided_fields) if provided_fields else 'none'}."
        )
        
        return message

    def _validate_answer_payload(
        self,
        play_mode: PlayMode,
        answer_payload: Dict[str, Any]
    ) -> None:
        """
        Validate answer_payload against the appropriate schema for the play_mode.
        """
        payload_schemas = {
            PlayMode.focus: FocusAnswerPayload,
            PlayMode.cloze: ClozeAnswerPayload,
            PlayMode.clarify: ClarifyAnswerPayload,
            PlayMode.summarize: SummarizeAnswerPayload,
            PlayMode.paraphrase: ParaphraseAnswerPayload
        }
        
        schema_class = payload_schemas.get(play_mode)
        
        if not schema_class:
            raise InvalidPayload(f"Unsupported play_mode: {play_mode}")
        
        try:
            schema_class.model_validate(answer_payload)
        except ValidationError as e:
            message = self._build_payload_validation_error_message(
                play_mode, e, schema_class, answer_payload
            )
            raise InvalidPayload(message)

    def _validate_and_get_round_for_attempt(
        self,
        game_session: GameSession,
        round_number: int,
        db_session: Session
    ) -> Tuple[GameRound, Dict[str, Any]]:
        """
        Validate all preconditions for submitting an attempt and return the round and challenge metadata.
        
        Returns:
            Tuple of (GameRound, challenge_metadata)
        """
        if round_number != game_session.current_round:
            raise BadRequest(
                f"Round number {round_number} does not match current round {game_session.current_round}"
            )
        
        game_round = self._get_existing_round(game_session, round_number, use_for_update=True, session=db_session)
        
        if not game_round:
            raise Missing(f"Round {round_number} not found for session {game_session.game_session_id}")
        
        if game_round.status != GameRoundStatus.served:
            raise BadRequest(
                f"Round must be in 'served' status to submit attempt. Current status: {game_round.status}"
            )
        
        if not game_round.play_mode:
            raise BadRequest("Round play_mode is not set")
        
        if not game_round.challenge_id:
            raise Missing("Round challenge is not assigned")
        
        challenge = self.challenge_service.get_challenge(game_round.challenge_id, db_session)
        challenge_metadata = challenge.challenge_metadata or {}
        
        return game_round, challenge_metadata

    def _create_and_save_submission(
        self,
        game_session: GameSession,
        game_round: GameRound,
        answer_payload: Dict[str, Any],
        score: float,
        is_correct: bool,
        feedback_short: str,
        user_id: UUID,
        client_elapsed_ms: Optional[int],
        idempotency_key: str,
        db_session: Session
    ) -> None:
        """
        Create and save a new submission, and update the game round status.
        """
        now = datetime.now(timezone.utc)
        
        submission = RoundSubmission(
            game_session_id=game_session.game_session_id,
            game_round_id=game_round.game_round_id,
            user_id=user_id,
            play_mode=game_round.play_mode,
            prompt_type=game_round.prompt_type,
            answer_payload=answer_payload,
            is_correct=is_correct,
            feedback_short=feedback_short,
            client_elapsed_ms=client_elapsed_ms,
            idempotency_key=idempotency_key,
            submitted_at=now
        )
        
        db_session.add(submission)
        
        game_round.status = GameRoundStatus.attempted
        game_round.score = score
        game_round.ended_at = now
        
        db_session.commit()
        db_session.refresh(game_round)

    def _build_submission_response(
        self,
        game_round: GameRound,
        is_correct: bool,
        score: float,
        feedback_short: str,
        client_elapsed_ms: Optional[int]
    ) -> AttemptSubmissionResponse:
        """
        Build the response for a submission attempt.
        """
        return AttemptSubmissionResponse(
            round_number=game_round.round_number,
            is_correct=is_correct,
            score=score,
            feedback_short=feedback_short,
            client_elapsed_ms=client_elapsed_ms,
            can_advance=True
        )

    def submit_attempt(
        self,
        game_session: GameSession,
        round_number: int,
        answer_payload: Dict[str, Any],
        idempotency_key: str,
        user_id: UUID,
        client_elapsed_ms: Optional[int],
        db_session: Session
    ) -> AttemptSubmissionResponse:
        """
        Submit an attempt for a game round with idempotency handling.
        
        Returns:
            AttemptSubmissionResponse with evaluation results.
        """
        try:
            game_round, challenge_metadata = self._validate_and_get_round_for_attempt(
                game_session, round_number, db_session
            )
            
            self._validate_answer_payload(game_round.play_mode, answer_payload)
            
            existing_submission = self._check_existing_submission(
                game_round, idempotency_key, answer_payload, db_session
            )
            
            if existing_submission:
                return self._build_submission_response(
                    game_round=game_round,
                    is_correct=existing_submission.is_correct,
                    score=game_round.score or 0.0,
                    feedback_short=existing_submission.feedback_short or "",
                    client_elapsed_ms=existing_submission.client_elapsed_ms
                )
            
            score, is_correct, feedback_short = evaluate_submitted_answer(
                play_mode=game_round.play_mode,
                answer_payload=answer_payload,
                challenge_metadata=challenge_metadata,
                max_score=game_round.max_score
            )
            
            self._create_and_save_submission(
                game_session=game_session,
                game_round=game_round,
                answer_payload=answer_payload,
                score=score,
                is_correct=is_correct,
                feedback_short=feedback_short,
                user_id=user_id,
                client_elapsed_ms=client_elapsed_ms,
                idempotency_key=idempotency_key,
                db_session=db_session
            )
            
            return self._build_submission_response(
                game_round=game_round,
                is_correct=is_correct,
                score=score,
                feedback_short=feedback_short,
                client_elapsed_ms=client_elapsed_ms
            )
            
        except APIException as api_error:
            raise api_error
        except Exception as err:
            db_session.rollback()
            handle_db_error(err, "submit_attempt", error_type="commit")