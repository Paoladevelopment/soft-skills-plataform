"""
Pydantic schemas for LLM structured output.
"""

from typing import List
from pydantic import BaseModel, Field


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


class ClarifyQuestionEvaluation(BaseModel):
    """Evaluation for a single clarifying question."""
    score_0_2: int = Field(ge=0, le=2, description="Score: 0=poor, 1=okay, 2=excellent")
    best_ref_index: int = Field(description="Index of closest reference question, or -1 if none")
    reason: str = Field(description="Brief reason for the score (<= 12 words)")
    flags: List[str] = Field(default_factory=list, description="Optional flags like 'too_vague', 'off_topic', etc.")


class ClarifyEvaluationResponse(BaseModel):
    """LLM response schema for evaluating clarifying questions."""
    per_question: List[ClarifyQuestionEvaluation]


class SummarizeEvaluationResponse(BaseModel):
    """LLM response schema for evaluating summarize answers."""
    score_0_2: int = Field(ge=0, le=2, description="Score: 0=poor, 1=okay, 2=excellent")
    reason: str = Field(description="Brief reason for the score (<= 12 words)")
    flags: List[str] = Field(default_factory=list, description="Optional flags indicating issues")


class ParaphraseEvaluationResponse(BaseModel):
    """LLM response schema for evaluating paraphrase answers."""
    criterion_1_0_2: int = Field(ge=0, le=2, description="Score for first rubric criterion: 0=poor, 1=okay, 2=excellent")
    criterion_2_0_2: int = Field(ge=0, le=2, description="Score for second rubric criterion: 0=poor, 1=okay, 2=excellent")
    criterion_3_0_2: int = Field(ge=0, le=2, description="Score for third rubric criterion: 0=poor, 1=okay, 2=excellent")
    score_0_2: int = Field(ge=0, le=2, description="Average score: 0=poor, 1=okay, 2=excellent")
    reason: str = Field(description="Brief reason for the overall score (<= 15 words)")
    flags: List[str] = Field(default_factory=list, description="Optional flags indicating issues")