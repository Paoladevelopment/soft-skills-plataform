from pydantic import BaseModel
from typing import TypeVar, Generic

T = TypeVar("T") 

class CreateResponse(BaseModel, Generic[T]):
    message: str
    data: T
