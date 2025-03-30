import logging

from fastapi import HTTPException, status

logger = logging.getLogger(__name__)

class APIException(Exception):
    """Base Exception Class for custom API errors"""
    status_code: int = status.HTTP_500_INTERNAL_SERVER_ERROR
    error_title: str = "Error"

    def __init__(self, msg: str):
        self.msg = msg
        super().__init__(msg)

    def to_http_exception(self):
        """Convert to FastAPI's HTTPException"""
        return HTTPException(
            status_code=self.status_code,
            detail={
                "error": self.error_title,
                "message": self.msg
            }
        )

class Missing(APIException):
    """Resource Not Found"""
    status_code = status.HTTP_404_NOT_FOUND
    error_title = "Not Found"

class Duplicate(APIException):
    """Conflict / Duplicate Entry"""
    status_code = status.HTTP_409_CONFLICT
    error_title = "Conflict"

class Forbidden(APIException):
    """Unauthorized Access"""
    status_code = status.HTTP_403_FORBIDDEN
    error_title = "Forbidden"

class InternalError(APIException):
    """Internal Server Error"""
    status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
    error_title = "Internal Server Error"

def handle_db_error(exc: Exception, function_name: str, error_type: str = "database"):
    log_message = f"Database {error_type.upper()} error in {function_name}: {str(exc)}"
    logger.error(log_message)
    
    raise InternalError("An unexpected error occurred. Please try again later.")

def raise_http_exception(exc: Exception):
    """Converts custom exceptions to FastAPI HTTPException"""
    if isinstance(exc, APIException):
        raise exc.to_http_exception()
    
    # Default to 500 Internal Server Error for unknown exceptions
    raise HTTPException(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        detail={
            "error": "Internal Server Error",
            "message": "An unexpected error occurred."
        }
    )

def raise_unauthorized_exception():
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail= {
            "error": "Unauthorized",
            "message": "Incorrect credentials"
        },
        headers={"WWW-Authenticate": "Bearer"},
    )