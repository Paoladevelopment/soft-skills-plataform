from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from model.user import User
from schema.auth import AuthResponse
from schema.user import UserCreate, UserRead
from service.auth_service import authenticate_user, generate_token
from service.user import UserService
from sqlmodel import Session
from utils.db import get_session
from utils.errors import (APIException, Missing, raise_http_exception,
                          raise_unauthorized_exception)

router = APIRouter()

user_service = UserService()

@router.post(
    "/login",
    response_model=AuthResponse
)
def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(), 
    session: Session = Depends(get_session)
):
    """
    ### Iniciar sesión para obtener token de acceso

    #### Args:
    La aplicación recibe los siguientes campos mediante form data:
    - **`username` (str)**: Su **dirección de correo electrónico** (OAuth2PasswordRequestForm usa `username`, pero en esta API, representa el correo electrónico del usuario).
    - **`password` (str)**: Su contraseña de cuenta.

    #### Returns:
    - **`access_token` (str)**: Un token JWT para autenticar solicitudes futuras.
    - **`token_type` (str)**: `"bearer"` (compatible con OAuth2).
    """
    try:
        user: User = authenticate_user(form_data.username, form_data.password, session)
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Correo electrónico o contraseña incorrectos"
            )
        
        user_service.update_last_login_from_user(user, session)
        
        access_token = generate_token(user)
        return AuthResponse(
            access_token=access_token, 
            token_type="bearer", 
            user=UserRead.model_validate(user)
        )
    
    except APIException as err:
        if isinstance(err, Missing):
            raise_unauthorized_exception()
        
        raise_http_exception(err)

@router.post(
    "/register",
    status_code=status.HTTP_201_CREATED,
    summary="Crear una nueva cuenta de usuario",
)
def create_user(
    user: UserCreate, 
    session: Session = Depends(get_session)
):
    try:
        _ = user_service.create_user(user, session)

        return {
            "message": "Usuario creado correctamente",
        }
    
    except APIException as exc:
        raise_http_exception(exc)      