import logging
from typing import Optional
from uuid import UUID

from sqlmodel import Session

from model.listening_core.challenge import Challenge
from schema.listening_core.challenge import GenerateChallenge, ChallengeRead, ChallengeAudioResponse
from llm.challenge_generator import generate_challenge_json
from utils.errors import APIException, Missing
from utils.eleven import get_elevenlabs_client
from utils.storage import get_storage_client
from utils.config import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()


class ChallengeService:
    def __init__(self):
        pass
    
    def get_challenge(self, challenge_id: UUID, session: Session) -> Challenge:
        """Get a challenge by ID."""
        try:
            challenge = session.get(Challenge, challenge_id)
            
            if not challenge:
                raise Missing(f"Desafío {challenge_id} no encontrado")
                
            return challenge
        
        except APIException as api_error:
            raise api_error
    
    def _get_existing_audio(self, challenge: Challenge, challenge_id: UUID, format: str) -> Optional[ChallengeAudioResponse]:
        """Check if audio exists in storage and return it."""
        try:
            storage_client = get_storage_client()
            bucket_name = settings.SUPABASE_BUCKET
            
            file_path = f"challenges-audio/{challenge_id}.{format}"
            
            if storage_client.exists(bucket_name, file_path):
                logger.info(f"Found existing audio for challenge {challenge_id}: {challenge.audio_url}")
                
                return ChallengeAudioResponse(
                    audio_url=challenge.audio_url
                )
                
        except Exception as e:
            logger.warning(f"Error checking existing audio: {str(e)}, will synthesize new audio")
            return None
    
    def _synthesize_and_upload_audio(
        self, 
        challenge: Challenge, 
        challenge_id: UUID, 
        format: str, 
        model_id: str, 
        voice_id: Optional[str],
        session: Session
    ) -> ChallengeAudioResponse:
        """Synthesize audio, upload to storage, and update challenge."""
        eleven_client = get_elevenlabs_client()
        storage_client = get_storage_client()
        
        audio_bytes = eleven_client.synthesize_text(
            audio_text=challenge.audio_text,
            voice_id=voice_id,
            model_id=model_id
        )
        
        file_path = f"challenges-audio/{challenge_id}.{format}"
        content_type = "audio/mpeg" if format == "mp3" else f"audio/{format}"
        
        audio_url = storage_client.upload(
            bucket_name=settings.SUPABASE_BUCKET,
            file_path=file_path,
            data=audio_bytes,
            content_type=content_type
        )
        
        challenge.audio_url = audio_url
        
        session.add(challenge)
        session.commit()
        session.refresh(challenge)
        
        return ChallengeAudioResponse(
            audio_url=audio_url
        )
    
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
            
            challenge = Challenge(
                play_mode=request.play_mode,
                prompt_type=request.prompt_type,
                difficulty=request.difficulty,
                audio_text=audio_text,
                language=request.locale,
                challenge_metadata=challenge_data
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
                f"Error al generar desafío: {str(e)}"
            )
    
    def get_or_create_audio(
        self,
        challenge_id: UUID,
        session: Session,
        voice_id: Optional[str] = None
    ) -> ChallengeAudioResponse:
        """
        Get or create audio for a challenge.
        
        If audio_url is set and file exists in storage, returns existing audio.
        Otherwise, synthesizes audio, uploads to storage, updates challenge, and returns audio.
        """
        format = settings.AUDIO_DEFAULT_FORMAT
        model_id = settings.ELEVENLABS_DEFAULT_MODEL
        
        challenge = self.get_challenge(challenge_id, session)
        
        if challenge.audio_url:
            existing_audio = self._get_existing_audio(challenge, challenge_id, format)
            if existing_audio:
                return existing_audio
        
        try:
            return self._synthesize_and_upload_audio(
                challenge, challenge_id, format, model_id, voice_id, session
            )
        except Exception as e:
            session.rollback()
            logger.error(f"Error synthesizing/uploading audio: {str(e)}")
            raise APIException(f"Error al sintetizar audio: {str(e)}")
    
