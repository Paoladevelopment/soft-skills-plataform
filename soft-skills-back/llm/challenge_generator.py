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
from utils.errors import APIException


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
    try:
        prompt_loader = PromptLoader()
        prompt_builder = PromptBuilder(prompt_loader)
        llm_client = LLMClient(model_name=model_name, temperature=temperature)
        
        chat_template = prompt_builder.build_chat_prompt(
            play_mode=play_mode,
            difficulty=difficulty
        )
        
        json_response = llm_client.execute_prompt(
            chat_template,
            prompt_type=prompt_type.value,
            audio_length=audio_length.value,
            locale=locale.value
        )
        
        return json_response
        
    except FileNotFoundError as e:
        raise APIException(
            f"Prompt file not found: {str(e)}"
        )

    except ValueError as e:
        raise APIException(
            f"Configuration error: {str(e)}"
        )
        
    except Exception as e:
        if isinstance(e, APIException):
            raise e
        
        raise APIException(
            f"Challenge generation failed: {str(e)}"
        )
