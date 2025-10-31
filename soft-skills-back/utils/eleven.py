"""ElevenLabs client for text-to-speech synthesis."""
import logging
from typing import Optional

from elevenlabs import ElevenLabs

from utils.config import get_settings
from utils.dialogue import parse_speaker_turns, is_dialogue, SpeakerTurn, get_default_voice_for_speaker

logger = logging.getLogger(__name__)
settings = get_settings()


class ElevenLabsClient:
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or settings.ELEVENLABS_API_KEY
        if not self.api_key:
            raise ValueError("ElevenLabs API key not configured")
        
        self.client = ElevenLabs(api_key=self.api_key)
    
    def _save_audio_to_bytes(self, audio_generator) -> bytes:
        """
        Collect audio bytes from the generator returned by elevenlabs.generate().
        """
        audio_bytes = b""
        for chunk in audio_generator:
            audio_bytes += chunk
        return audio_bytes
    
    def synthesize_single(
        self,
        text: str,
        voice_id: Optional[str] = None,
        model_id: Optional[str] = None,
    ) -> bytes:
        voice_id = voice_id or settings.VOICE_DEFAULT_SINGLE
        model_id = model_id or settings.ELEVENLABS_DEFAULT_MODEL
        
        if not voice_id:
            raise ValueError("No voice ID configured")
           
        try:
            audio_generator = self.client.generate(
                text=text,
                voice=voice_id,
                model=model_id
            )
            
            audio_bytes = self._save_audio_to_bytes(audio_generator)
            
            logger.info(f"Generated {len(audio_bytes)} bytes of audio")
            return audio_bytes
            
        except Exception as e:
            logger.error(f"Error synthesizing audio: {str(e)}")
            raise
    
    def synthesize_dialogue(
        self,
        turns: list[SpeakerTurn],
        model_id: Optional[str] = None,
    ) -> bytes:
        """
        Synthesize dialogue with multiple speakers by generating each turn separately
        and concatenating the audio bytes.
        """
        model_id = model_id or settings.ELEVENLABS_DEFAULT_MODEL
        
        turn_audio_list = []
        
        for turn in turns:
            voice_id = get_default_voice_for_speaker(turn.speaker, settings)
            
            if not voice_id:
                logger.warning(f"No voice configured for {turn.speaker}, using default")
                voice_id = settings.VOICE_DEFAULT_SINGLE
            
            turn_audio = self.synthesize_single(
                text=turn.text,
                voice_id=voice_id,
                model_id=model_id
            )
            
            turn_audio_list.append(turn_audio)
        
        # Simple concatenation of MP3 bytes
        combined_audio = b"".join(turn_audio_list)
        
        logger.info(f"Generated dialogue audio: {len(combined_audio)} bytes")
        return combined_audio
    
    def synthesize_text(
        self,
        audio_text: str,
        voice_id: Optional[str] = None,
        model_id: Optional[str] = None,
    ) -> bytes:
        """
        Synthesize audio from text, handling both single and dialogue modes.
        """
        model_id = model_id or settings.ELEVENLABS_DEFAULT_MODEL
        
        if is_dialogue(audio_text):
            turns = parse_speaker_turns(audio_text)
            return self.synthesize_dialogue(turns, model_id)

        else:
            return self.synthesize_single(audio_text, voice_id, model_id)
    

def get_elevenlabs_client() -> ElevenLabsClient:
    """
    Get a configured ElevenLabs client instance.
    """
    return ElevenLabsClient()

