"""
Challenge generator module for generating listening challenges using LLM.

Provides the main public function to generate challenge JSON based on parameters.
"""

from typing import Dict, Any
from enums.listening_game import PlayMode, PromptType, Difficulty, AudioLength
from enums.common.language import Language
from .prompt_loader import PromptLoader
from .prompt_builder import PromptBuilder
from .models import LLMClient
from .schemas import FocusChallenge, ClozeChallenge, ParaphraseChallenge, SummarizeChallenge, ClarifyChallenge
from utils.errors import APIException, BadRequest

def _validate_combination(play_mode: PlayMode, prompt_type: PromptType) -> None:
    """Validate that the play mode and prompt type combination is allowed, raising BadRequest if invalid."""
    if play_mode == PlayMode.paraphrase and prompt_type == PromptType.dialogue:
        raise BadRequest(
            "El modo paráfrasis no está soportado para el tipo de prompt diálogo. "
            "Por favor, use un modo de juego o tipo de prompt diferente."
        )
    
    if play_mode == PlayMode.cloze and prompt_type == PromptType.dialogue:
        raise BadRequest(
            "El modo cloze no está soportado para el tipo de prompt diálogo. "
            "Por favor, use un modo de juego o tipo de prompt diferente."
        )


def generate_challenge_json(
    play_mode: PlayMode,
    prompt_type: PromptType,
    difficulty: Difficulty,
    audio_length: AudioLength,
    locale: Language,
    model_name: str = "gpt-4o-mini",
    temperature: float = 0.7
) -> Dict[str, Any]:
    """
    Generate a listening challenge JSON using LLM.
    
    Args:
        play_mode: The play mode (focus, cloze, paraphrase, summarize, clarify).
        prompt_type: The prompt type token for system base.
        difficulty: The difficulty level (easy, intermediate, hard).
        audio_length: The desired audio length (short, medium, long).
        locale: The target locale/language for all content.
        model_name: OpenAI model name (default: gpt-4o-mini).
        temperature: Model temperature (default: 0.7).
        
    Returns:
        Dictionary containing the generated challenge data in JSON format.
    """
    _validate_combination(play_mode, prompt_type)
    
    try:
        prompt_loader = PromptLoader()
        prompt_builder = PromptBuilder(prompt_loader)
        llm_client = LLMClient(model_name=model_name, temperature=temperature)
        
        chat_template = prompt_builder.build_chat_prompt(
            play_mode=play_mode,
            difficulty=difficulty
        )
        
        schema_map = {
            PlayMode.focus: FocusChallenge,
            PlayMode.cloze: ClozeChallenge,
            PlayMode.paraphrase: ParaphraseChallenge,
            PlayMode.summarize: SummarizeChallenge,
            PlayMode.clarify: ClarifyChallenge
        }
        
        response_schema = schema_map[play_mode]
        
        structured_response = llm_client.execute_prompt(
            chat_template,
            response_schema,
            prompt_type=prompt_type.value,
            audio_length=audio_length.value,
            locale=locale.value,
            difficulty=difficulty.value
        )
        
        return structured_response.model_dump()
        
    except FileNotFoundError as e:
        raise APIException(
            f"Archivo de prompt no encontrado: {str(e)}"
        )

    except ValueError as e:
        raise APIException(
            f"Error de configuración: {str(e)}"
        )
        
    except Exception as e:
        if isinstance(e, APIException):
            raise e
        
        raise APIException(
            f"Error al generar desafío: {str(e)}"
        )
