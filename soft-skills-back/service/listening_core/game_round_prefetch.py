from uuid import UUID
import time
import logging

from model.listening_core.game_session import GameSession
from model.listening_core.game_session_config import GameSessionConfig
from enums.listening_game import GameStatus
from service.listening_core.game_round import GameRoundService
from utils.db import Session, engine

logger = logging.getLogger(__name__)


def _load_session_and_config(db_session: Session, session_id: UUID) -> tuple[GameSession, GameSessionConfig] | None:
    """Load session and config from database. Return None if session is not active or config missing."""
    game_session = db_session.get(GameSession, session_id)
    if not game_session or game_session.status != GameStatus.in_progress:
        return None
    
    config = db_session.get(GameSessionConfig, session_id)
    if not config:
        return None
    
    return game_session, config


def _prefetch_single_round(
    service: GameRoundService,
    game_session: GameSession,
    config: GameSessionConfig,
    round_number: int,
    db_session: Session
) -> None:
    """Prepare a single round. Silently skip on error (non-blocking)."""
    try:
        service.prepare_or_get_round(
            game_session.game_session_id,
            round_number,
            game_session,
            config,
            db_session=db_session
        )
        logger.info(f"✓ Prefetched round {round_number} for session {game_session.game_session_id}")
    except Exception as err:
        logger.warning(f"✗ Failed to prefetch round {round_number}: {str(err)}")


def _should_skip_round(game_session: GameSession, round_number: int) -> bool:
    """Check if round should be skipped (already completed in previous iterations)."""
    return round_number < game_session.current_round


def _retry_sleep(attempt_index: int) -> None:
    """Sleep with exponential backoff. Attempt 0 → 1s, attempt 1 → 2s, etc."""
    time.sleep(1 * (attempt_index + 1))


def _prefetch_rounds_attempt(session_id: UUID, round_numbers: list[int]) -> bool:
    """Load session, verify active status, and prepare requested rounds. 
    Return success status."""
    with Session(engine) as db_session:
        load_result = _load_session_and_config(db_session, session_id)
        if load_result is None:
            logger.warning(f"⚠ Session {session_id} not found or not active - skipping prefetch")
            return False
        
        game_session, config = load_result
        service = GameRoundService()
        logger.info(f"→ Starting prefetch for session {session_id}, rounds {round_numbers}")
        
        for round_number in round_numbers:
            if _should_skip_round(game_session, round_number):
                logger.debug(f"  Skipping round {round_number} (already completed)")
                continue
            
            _prefetch_single_round(service, game_session, config, round_number, db_session)
        
        logger.info(f"✓ Prefetch completed for session {session_id}")
        return True


def safe_prefetch_rounds(session_id: UUID, round_numbers: list[int], retries: int = 2) -> None:
    """Prefetch and prepare game rounds in background with automatic retry and backoff."""
    logger.info(f"🔄 Background prefetch started for session {session_id}")
    
    for retry_attempt in range(retries):
        success = _prefetch_rounds_attempt(session_id, round_numbers)
        
        if success:
            logger.info(f"✅ Background prefetch successful for session {session_id}")
            return
        
        if retry_attempt < retries - 1:
            logger.warning(f"⟳ Retrying prefetch (attempt {retry_attempt + 2}/{retries})...")
            _retry_sleep(retry_attempt)
    
    logger.error(f"❌ Background prefetch failed for session {session_id} after {retries} attempts")
