from fastapi import HTTPException, status
import logging

logger = logging.getLogger(__name__)

class Missing(Exception):
    def __init__(self, msg: str):
        self.msg = msg


class Duplicate(Exception):
    def __init__(self, msg: str):
        self.msg = msg

class InternalError(Exception):
    def __init__(self, msg: str):
        self.msg = msg

def handle_db_error(exc: Exception, function_name: str, error_type: str = "database"):
    log_message = f"Database {error_type.upper()} error in {function_name}: {str(exc)}"
    logger.error(log_message)
    
    raise InternalError("An unexpected error occurred. Please try again later.")

def raise_http_exception(exc: Exception):
    error_mapping = {
        Missing: (status.HTTP_404_NOT_FOUND, "Not found"),
        Duplicate: (status.HTTP_409_CONFLICT, "Conflict"),
        InternalError: (status.HTTP_500_INTERNAL_SERVER_ERROR, "Internal Server Error"),
    }

    http_status, error_title = error_mapping.get(type(exc), (status.HTTP_500_INTERNAL_SERVER_ERROR, "Error"))

    raise HTTPException(
        status_code=http_status,
        detail={
            "error": error_title,
            "message": exc.msg
        }
    )