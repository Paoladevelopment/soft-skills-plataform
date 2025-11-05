"""
LLM module for generating listening challenges using LangChain and OpenAI.

This module provides functionality to load prompts, build chat templates,
and execute LLM models to generate JSON responses for listening challenges.
"""

from .prompt_loader import PromptLoader
from .prompt_builder import PromptBuilder
from .models import LLMClient
from .challenge_generator import generate_challenge_json
from .challenge_evaluation import evaluate_clarify_questions, evaluate_summarize_answer, evaluate_paraphrase_answer

__all__ = [
    "PromptLoader",
    "PromptBuilder", 
    "LLMClient",
    "generate_challenge_json",
    "evaluate_clarify_questions",
    "evaluate_summarize_answer",
    "evaluate_paraphrase_answer"
]
