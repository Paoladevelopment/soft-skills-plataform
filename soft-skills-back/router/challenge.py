from fastapi import APIRouter, Depends, status
from sqlmodel import Session

from schema.listening_core.challenge import GenerateChallenge, ChallengeRead, ChallengeResponse
from service.challenge import ChallengeService
from utils.db import get_session
from utils.errors import APIException, raise_http_exception

router = APIRouter()

challenge_service = ChallengeService()


@router.post(
    "/generate",
    response_model=ChallengeResponse,
    summary="Generate a new listening challenge using LLM",
    status_code=status.HTTP_201_CREATED
)
def generate_challenge(
    request: GenerateChallenge,
    session: Session = Depends(get_session)
):
    try:
        challenge = challenge_service.generate_challenge(request, session)
        
        return ChallengeResponse(
            message="Challenge generated successfully",
            data=challenge
        )
        
    except APIException as err:
        raise_http_exception(err)
