
from fastapi import APIRouter, Depends
from sqlmodel import Session
from utils.db import get_session
from fastapi.security import OAuth2PasswordRequestForm
from schema.token import Token
from service.auth_service import generate_token


router = APIRouter()

@router.post(
    "/login",
    response_model=Token
)
def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(), 
    db: Session = Depends(get_session)
    ):
    """
    ### Login for access token

    #### Args:
    The app receives the following fields via form data:
    - **`username` (str)**: Your **email address** (OAuth2PasswordRequestForm uses `username`, but in this API, it represents the user's email).
    - **`password` (str)**: Your account password.

    #### Returns:
    - **`access_token` (str)**: A JWT token to authenticate future requests.
    - **`token_type` (str)**: `"bearer"` (OAuth2-compatible).
    """
    access_token = generate_token(form_data.username, form_data.password, db)
    return Token(access_token=access_token, token_type="bearer")