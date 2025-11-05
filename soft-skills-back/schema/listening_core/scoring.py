from pydantic import BaseModel, Field

from utils.payloads_listening_game import (
    ATTEMPT_SUBMISSION_PARAPHRASE_EXAMPLE,
    ATTEMPT_SUBMISSION_CLARIFY_EXAMPLE,
    ATTEMPT_SUBMISSION_SUMMARIZE_EXAMPLE,
    ATTEMPT_SUBMISSION_FOCUS_EXAMPLE,
    ATTEMPT_SUBMISSION_CLOZE_EXAMPLE
)


class FocusAnswerPayload(BaseModel):
    """Payload for focus mode answer submission."""
    selected_index: int = Field(ge=0, description="Index of the selected answer choice")
    
    model_config = {
        "json_schema_extra": {
            "example": ATTEMPT_SUBMISSION_FOCUS_EXAMPLE["answer_payload"]
        }
    }


class FocusMultipleChoice(BaseModel):
    """Multiple choice question data from challenge metadata."""
    question: str
    answer_choices: list[str] = Field(min_length=1, description="List of answer choices")
    correct_answer: str


class ClozeAnswerPayload(BaseModel):
    """Payload for cloze mode answer submission."""
    blanks: list[str] = Field(min_length=1, description="List of user answers for each blank")
    
    model_config = {
        "json_schema_extra": {
            "example": ATTEMPT_SUBMISSION_CLOZE_EXAMPLE["answer_payload"]
        }
    }


class ClozeSpec(BaseModel):
    """Cloze mode question data from challenge metadata."""
    text_with_blanks: str
    answers: list[str] = Field(min_length=1, description="List of correct answers for each blank")


class ClarifyAnswerPayload(BaseModel):
    """Payload for clarify mode answer submission."""
    questions: list[str] = Field(
        min_length=1,
        max_length=5,
        description="List of clarifying questions (1-5 items)"
    )
    
    model_config = {
        "json_schema_extra": {
            "example": ATTEMPT_SUBMISSION_CLARIFY_EXAMPLE["answer_payload"]
        }
    }


class ClarifySpec(BaseModel):
    """Cloze mode question data from challenge metadata."""
    possible_questions: list[str] = Field(
        min_length=1,
        description="List of reference clarifying questions"
    )


class SummarizeAnswerPayload(BaseModel):
    """Payload for summarize mode answer submission."""
    summary: str = Field(min_length=1, description="Player's summary of the audio content")
    
    model_config = {
        "json_schema_extra": {
            "example": ATTEMPT_SUBMISSION_SUMMARIZE_EXAMPLE["answer_payload"]
        }
    }


class SummarizeSpec(BaseModel):
    """Summarize mode challenge data from challenge metadata."""
    reference_summary: str = Field(description="Reference summary for comparison")


class ParaphraseAnswerPayload(BaseModel):
    """Payload for paraphrase mode answer submission."""
    paraphrase: str = Field(min_length=1, description="Player's paraphrase of the audio content")
    
    model_config = {
        "json_schema_extra": {
            "example": ATTEMPT_SUBMISSION_PARAPHRASE_EXAMPLE["answer_payload"]
        }
    }


class ParaphraseSpec(BaseModel):
    """Paraphrase mode challenge data from challenge metadata."""
    reference_text: str = Field(description="Reference text for comparison")
    rubric: list[str] = Field(min_length=1, description="List of evaluation criteria")
