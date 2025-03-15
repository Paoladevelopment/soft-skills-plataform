from typing import Generic, List, TypeVar

from pydantic import BaseModel

T = TypeVar("T") 

class BaseResponse(BaseModel, Generic[T]):
    """Generic base response model"""
    message: str
    data: T
    
class PaginatedResponse(BaseResponse[List[T]], Generic[T]):
    """Generic paginated response model"""
    total: int
    offset: int
    limit: int
    total: int
