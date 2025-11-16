from fastapi import status
from utils.errors import APIException


class InvalidPayload(APIException):
    """Invalid answer payload format or values"""
    status_code = status.HTTP_400_BAD_REQUEST
    error_title = "Payload inválido"


class MisconfiguredChallenge(APIException):
    """Challenge metadata is missing required fields or malformed"""
    status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
    error_title = "Desafío mal configurado"


class UnsupportedPlayMode(APIException):
    """Play mode is not supported for scoring"""
    status_code = status.HTTP_400_BAD_REQUEST
    error_title = "Modo de juego no soportado"

