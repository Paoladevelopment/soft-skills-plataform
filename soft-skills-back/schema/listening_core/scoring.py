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
    selected_index: int = Field(ge=0, description="Índice de la opción de respuesta seleccionada")
    
    model_config = {
        "json_schema_extra": {
            "example": ATTEMPT_SUBMISSION_FOCUS_EXAMPLE["answer_payload"]
        }
    }


class FocusMultipleChoice(BaseModel):
    """Multiple choice question data from challenge metadata."""
    question: str
    answer_choices: list[str] = Field(min_length=1, description="Lista de opciones de respuesta")
    correct_answer: str


class ClozeAnswerPayload(BaseModel):
    """Payload for cloze mode answer submission."""
    blanks: list[str] = Field(min_length=1, description="Lista de respuestas del usuario para cada espacio en blanco")
    
    model_config = {
        "json_schema_extra": {
            "example": ATTEMPT_SUBMISSION_CLOZE_EXAMPLE["answer_payload"]
        }
    }


class ClozeSpec(BaseModel):
    """Cloze mode question data from challenge metadata."""
    text_with_blanks: str
    answers: list[str] = Field(min_length=1, description="Lista de respuestas correctas para cada espacio en blanco")


class ClarifyAnswerPayload(BaseModel):
    """Payload for clarify mode answer submission."""
    questions: list[str] = Field(
        min_length=1,
        max_length=5,
        description="Lista de preguntas de clarificación (1-5 elementos)"
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
        description="Lista de preguntas de clarificación de referencia"
    )


class SummarizeAnswerPayload(BaseModel):
    """Payload for summarize mode answer submission."""
    summary: str = Field(min_length=1, description="Resumen del jugador del contenido de audio")
    
    model_config = {
        "json_schema_extra": {
            "example": ATTEMPT_SUBMISSION_SUMMARIZE_EXAMPLE["answer_payload"]
        }
    }


class SummarizeSpec(BaseModel):
    """Summarize mode challenge data from challenge metadata."""
    reference_summary: str = Field(description="Resumen de referencia para comparación")


class ParaphraseAnswerPayload(BaseModel):
    """Payload for paraphrase mode answer submission."""
    paraphrase: str = Field(min_length=1, description="Paráfrasis del jugador del contenido de audio")
    
    model_config = {
        "json_schema_extra": {
            "example": ATTEMPT_SUBMISSION_PARAPHRASE_EXAMPLE["answer_payload"]
        }
    }


class ParaphraseSpec(BaseModel):
    """Paraphrase mode challenge data from challenge metadata."""
    reference_text: str = Field(description="Texto de referencia para comparación")
    rubric: list[str] = Field(min_length=1, description="Lista de criterios de evaluación")
