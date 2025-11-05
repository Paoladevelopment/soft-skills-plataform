from typing import Tuple, Dict, Any
import unicodedata
import re

from pydantic import ValidationError

from enums.listening_game import PlayMode
from schema.listening_core.scoring import (
    FocusAnswerPayload,
    FocusMultipleChoice,
    ClozeAnswerPayload,
    ClozeSpec,
    ClarifyAnswerPayload,
    ClarifySpec,
    SummarizeAnswerPayload,
    SummarizeSpec,
    ParaphraseAnswerPayload,
    ParaphraseSpec
)
from llm.challenge_evaluation import evaluate_clarify_questions, evaluate_summarize_answer, evaluate_paraphrase_answer
from llm.schemas import ClarifyEvaluationResponse, SummarizeEvaluationResponse, ParaphraseEvaluationResponse
from utils.scoring_errors import InvalidPayload, MisconfiguredChallenge, UnsupportedPlayMode
from utils.errors import APIException


def normalize_text(text: str) -> str:
    """
    Normalize text for comparison
    """
    # Trim
    text = text.strip()
    
    # Lowercase
    text = text.lower()
    
    # Remove accents/diacritics
    text = unicodedata.normalize('NFD', text)
    text = ''.join(char for char in text if unicodedata.category(char) != 'Mn')
    
    # Collapse multiple spaces to single space
    text = re.sub(r'\s+', ' ', text)
    
    return text.strip()


def evaluate_submitted_answer(
    play_mode: PlayMode,
    answer_payload: Dict[str, Any],
    challenge_metadata: Dict[str, Any],
    max_score: float
) -> Tuple[float, bool, str]:
    """
    Evaluate a submitted answer for a game round. 
    Returns the score, whether the answer is correct, and a short feedback message.
    """
    if play_mode == PlayMode.focus:
        return _evaluate_focus_answer(answer_payload, challenge_metadata, max_score)
    
    elif play_mode == PlayMode.cloze:
        return _evaluate_cloze_answer(answer_payload, challenge_metadata, max_score)
    
    elif play_mode == PlayMode.clarify:
        return _evaluate_clarify_answer(answer_payload, challenge_metadata, max_score)
    
    elif play_mode == PlayMode.summarize:
        return _evaluate_summarize_answer(answer_payload, challenge_metadata, max_score)
    
    elif play_mode == PlayMode.paraphrase:
        return _evaluate_paraphrase_answer(answer_payload, challenge_metadata, max_score)
    


def _evaluate_focus_answer(
    answer_payload: Dict[str, Any],
    challenge_metadata: Dict[str, Any],
    max_score: float
) -> Tuple[float, bool, str]:
    """Evaluate answer for focus (multiple choice) mode."""
    try:
        user_answer = FocusAnswerPayload.model_validate(answer_payload)
    except ValidationError as e:
        raise InvalidPayload(f"Invalid answer payload: {e}")
    
    try:
        spec = FocusMultipleChoice.model_validate(challenge_metadata)
    except ValidationError as e:
        raise MisconfiguredChallenge(f"Invalid challenge metadata: {e}")
    
    if not (0 <= user_answer.selected_index < len(spec.answer_choices)):
        raise InvalidPayload(
            f"Selected index {user_answer.selected_index} is out of range [0, {len(spec.answer_choices)})"
        )
    
    player_answer = normalize_text(spec.answer_choices[user_answer.selected_index])
    correct_answer = normalize_text(spec.correct_answer)
    
    is_correct = player_answer == correct_answer
    score_final = max_score if is_correct else 0.0
    feedback_short = "Correct!" if is_correct else "Incorrect!"
    
    return (
        score_final,
        is_correct,
        feedback_short
    )


def _evaluate_cloze_answer(
    answer_payload: Dict[str, Any],
    challenge_metadata: Dict[str, Any],
    max_score: float
) -> Tuple[float, bool, str]:
    """Evaluate answer for cloze (fill in the blanks) mode."""
    try:
        user_answer = ClozeAnswerPayload.model_validate(answer_payload)
    except ValidationError as e:
        raise InvalidPayload(f"Invalid answer payload: {e}")
    
    try:
        spec = ClozeSpec.model_validate(challenge_metadata)
    except ValidationError as e:
        raise MisconfiguredChallenge(f"Invalid challenge metadata: {e}")
    
    if len(user_answer.blanks) != len(spec.answers):
        raise InvalidPayload(
            f"Expected {len(spec.answers)} blanks, got {len(user_answer.blanks)}"
        )
    
    user_normalized = [normalize_text(blank) for blank in user_answer.blanks]
    key_normalized = [normalize_text(answer) for answer in spec.answers]
    
    matched = sum(user_normalized[i] == key_normalized[i] for i in range(len(key_normalized)))
    total = len(key_normalized)
    
    ratio = matched / total
    score_final = round(max_score * ratio, 2)
    is_correct = (matched == total)
    
    if is_correct:
        feedback_short = "Perfect!"
    else:
        feedback_short = f"{matched}/{total} correct"
    
    return (
        score_final,
        is_correct,
        feedback_short
    )


def _calculate_clarify_score(
    evaluation: ClarifyEvaluationResponse,
    total_questions: int,
    max_score: float
) -> Tuple[float, bool, str]:
    """
    Calculate final score, correctness, and feedback for clarify mode evaluation.
    
    Args:
        evaluation: LLM evaluation response with per-question scores.
        total_questions: Total number of questions submitted.
        max_score: Maximum possible score for this round.
        
    Returns:
        Tuple of (score_final, is_correct, feedback_short).
    """
    per_question_points = {
        0: 0.0, 
        1: 0.5, 
        2: 1.0
    }
    points = [per_question_points[question_eval.score_0_2] for question_eval in evaluation.per_question]

    raw = sum(points)
    average_score = raw / total_questions
    score_final = round(max_score * average_score, 2)
    
    is_correct = average_score >= 0.8
    
    strong_count = sum(1 for question_eval in evaluation.per_question if question_eval.score_0_2 == 2)
    
    if is_correct:
        feedback_short = "Great clarifying questions!"
    else:
        feedback_short = f"{strong_count}/{total_questions} strong questions"
    
    return (score_final, is_correct, feedback_short)


def _evaluate_clarify_answer(
    answer_payload: Dict[str, Any],
    challenge_metadata: Dict[str, Any],
    max_score: float
) -> Tuple[float, bool, str]:
    """Evaluate answer for clarify mode using LLM."""
    try:
        user_answer = ClarifyAnswerPayload.model_validate(answer_payload)
    except ValidationError as e:
        raise InvalidPayload(f"Invalid answer payload: {e}")
    
    try:
        spec = ClarifySpec.model_validate(challenge_metadata)
    except ValidationError as e:
        raise MisconfiguredChallenge(f"Invalid challenge metadata: {e}")
    
    try:
        evaluation = evaluate_clarify_questions(
            reference_questions=spec.possible_questions,
            player_questions=user_answer.questions
        )
        
        return _calculate_clarify_score(
            evaluation=evaluation,
            total_questions=len(user_answer.questions),
            max_score=max_score
        )
        
    except APIException:
        raise
    except Exception as e:
        raise APIException(f"Failed to evaluate clarifying questions: {str(e)}")


def _calculate_summarize_score(
    evaluation: SummarizeEvaluationResponse,
    max_score: float
) -> Tuple[float, bool, str]:
    """
    Calculate final score, correctness, and feedback for summarize mode evaluation.
    
    Args:
        evaluation: LLM evaluation response.
        max_score: Maximum possible score for this round.
        
    Returns:
        Tuple of (score_final, is_correct, feedback_short).
    """
    per_question_points = {
        0: 0.0,
        1: 0.5,
        2: 1.0
    }
    average_score = per_question_points[evaluation.score_0_2]
    score_final = round(max_score * average_score, 2)
    
    is_correct = average_score >= 0.8
    
    if is_correct:
        feedback_short = "Excellent summary!"
    elif evaluation.score_0_2 == 1:
        feedback_short = "Good summary, but could be more complete."
    else:
        feedback_short = "Summary needs improvement."
    
    return (score_final, is_correct, feedback_short)


def _evaluate_summarize_answer(
    answer_payload: Dict[str, Any],
    challenge_metadata: Dict[str, Any],
    max_score: float
) -> Tuple[float, bool, str]:
    """Evaluate answer for summarize mode using LLM."""
    try:
        user_answer = SummarizeAnswerPayload.model_validate(answer_payload)
    except ValidationError as e:
        raise InvalidPayload(f"Invalid answer payload: {e}")
    
    try:
        spec = SummarizeSpec.model_validate(challenge_metadata)
    except ValidationError as e:
        raise MisconfiguredChallenge(f"Invalid challenge metadata: {e}")
    
    try:
        evaluation = evaluate_summarize_answer(
            reference_summary=spec.reference_summary,
            player_summary=user_answer.summary
        )
        
        return _calculate_summarize_score(
            evaluation=evaluation,
            max_score=max_score
        )
        
    except APIException:
        raise
    except Exception as e:
        raise APIException(f"Failed to evaluate summarize answer: {str(e)}")


def _calculate_paraphrase_score(
    evaluation: ParaphraseEvaluationResponse,
    max_score: float
) -> Tuple[float, bool, str]:
    """
    Calculate final score, correctness, and feedback for paraphrase mode evaluation.
    
    Args:
        evaluation: LLM evaluation response with three criterion scores.
        max_score: Maximum possible score for this round.
    """
    per_score_points = {
        0: 0.0,
        1: 0.5,
        2: 1.0
    }
    
    average_score = per_score_points[evaluation.score_0_2]
    score_final = round(max_score * average_score, 2)
    
    is_correct = average_score >= 0.8
    
    if is_correct:
        feedback_short = "Excellent paraphrase!"
    elif evaluation.score_0_2 == 1:
        feedback_short = "Good paraphrase, but could be improved."
    else:
        feedback_short = "Paraphrase needs improvement."
    
    return (score_final, is_correct, feedback_short)


def _evaluate_paraphrase_answer(
    answer_payload: Dict[str, Any],
    challenge_metadata: Dict[str, Any],
    max_score: float
) -> Tuple[float, bool, str]:
    """Evaluate answer for paraphrase mode using LLM."""
    try:
        user_answer = ParaphraseAnswerPayload.model_validate(answer_payload)
    except ValidationError as e:
        raise InvalidPayload(f"Invalid answer payload: {e}")
    
    try:
        spec = ParaphraseSpec.model_validate(challenge_metadata)
    except ValidationError as e:
        raise MisconfiguredChallenge(f"Invalid challenge metadata: {e}")
    
    try:
        evaluation = evaluate_paraphrase_answer(
            reference_text=spec.reference_text,
            player_paraphrase=user_answer.paraphrase,
            rubric=spec.rubric
        )
        
        return _calculate_paraphrase_score(
            evaluation=evaluation,
            max_score=max_score
        )
        
    except APIException:
        raise
    except Exception as e:
        raise APIException(f"Failed to evaluate paraphrase answer: {str(e)}")

