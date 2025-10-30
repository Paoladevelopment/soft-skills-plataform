"""
Pydantic schemas for LLM structured output.
"""

from typing import List
from pydantic import BaseModel


class FocusChallenge(BaseModel):
    """Schema for focus listening challenges."""
    audio_text: str
    question: str
    answer_choices: List[str]
    correct_answer: str


class ClozeChallenge(BaseModel):
    """Schema for cloze listening challenges."""
    audio_text: str
    text_with_blanks: str
    answers: List[str]


class ParaphraseChallenge(BaseModel):
    """Schema for paraphrase listening challenges."""
    audio_text: str
    reference_text: str
    rubric: List[str]


class SummarizeChallenge(BaseModel):
    """Schema for summarize listening challenges."""
    audio_text: str
    reference_summary: str


class ClarifyChallenge(BaseModel):
    """Schema for clarify listening challenges."""
    audio_text: str
    possible_questions: List[str]
