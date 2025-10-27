from sqlmodel import Session

from model.listening_core.challenge import Challenge
from schema.listening_core.challenge import GenerateChallenge, ChallengeRead
from llm.challenge_generator import generate_challenge_json
from utils.errors import APIException


class ChallengeService:
    def __init__(self):
        pass
    
    def generate_challenge(self, request: GenerateChallenge, session: Session) -> ChallengeRead:
        """Generate a new challenge using LLM and save it to database."""
        try:
            challenge_data = generate_challenge_json(
                play_mode=request.play_mode,
                prompt_type=request.prompt_type,
                difficulty=request.difficulty,
                audio_length=request.audio_length,
                locale=request.locale
            )
            
            audio_text = challenge_data.pop("audio_text", "")
            metadata = challenge_data
            
            challenge = Challenge(
                play_mode=request.play_mode,
                prompt_type=request.prompt_type,
                difficulty=request.difficulty,
                audio_text=audio_text,
                language=request.locale,
                challenge_metadata=metadata
            )
            
            session.add(challenge)
            session.commit()
            session.refresh(challenge)
            
            return ChallengeRead(
                challenge_id=challenge.challenge_id,
                play_mode=challenge.play_mode,
                prompt_type=challenge.prompt_type,
                difficulty=challenge.difficulty,
                audio_url=challenge.audio_url,
                audio_text=challenge.audio_text,
                created_at=challenge.created_at
            )
            
        except Exception as e:
            session.rollback()
            raise APIException(
                f"Failed to generate challenge: {str(e)}"
            )
    
