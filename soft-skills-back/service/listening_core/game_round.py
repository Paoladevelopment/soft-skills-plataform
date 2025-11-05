from typing import Tuple, Sequence, Optional
from uuid import UUID
from datetime import datetime, timezone
import random
from collections import Counter

from sqlmodel import Session, select

from model.listening_core.game_session import GameSession
from model.listening_core.game_session_config import GameSessionConfig
from model.listening_core.game_round import GameRound
from model.listening_core.challenge import Challenge
from enums.listening_game import GameRoundStatus, PlayMode, PromptType
from enums.common.language import Language
from schema.listening_core.challenge import GenerateChallenge
from utils.errors import APIException, Missing, InternalError, handle_db_error
from utils.listening_defaults import get_audio_length_for_difficulty
from service.challenge import ChallengeService


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

    def _build_valid_combinations(self, config: GameSessionConfig) -> list[tuple[PlayMode, PromptType]]:
        """Build all valid mode and type combinations from config."""
        return [
            (mode, ptype) for mode in config.selected_modes for ptype in config.allowed_types
        ]

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
        session_id: UUID, 
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
        if game_round.status != GameRoundStatus.served:
            game_round.status = GameRoundStatus.served

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
            game_session.game_session_id,
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