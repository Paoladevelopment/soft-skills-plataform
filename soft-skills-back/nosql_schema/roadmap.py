from nosql_models.roadmap import Roadmap

def roadmap_serializer(model: Roadmap) -> dict:
  return model.model_dump()

def to_roadmap_model(doc: dict) -> Roadmap:
  doc["roadmap_id"] = str(doc.pop("_id"))
  return Roadmap(**doc)

from typing import List, Optional, TypeVar
from pydantic import BaseModel, HttpUrl

from enums.resource import ResourceType
from enums.roadmap import Visibility
from schema.base import BaseResponse, PaginatedResponse
from utils.payloads import (ROADMAP_CREATE_EXAMPLE, ROADMAP_READ_EXAMPLE, ROADMAP_UPDATE_EXAMPLE)

T = TypeVar("T")


class Resource(BaseModel):
    type: ResourceType
    title: str
    url: HttpUrl


class Task(BaseModel):
    title: str
    order_index: int
    resources: List[Resource]


class Objective(BaseModel):
    title: str
    order_index: int
    tasks: List[Task]


class RoadmapBase(BaseModel):
    title: str
    description: str
    objectives: List[Objective]
    visibility: Visibility = Visibility.private


class RoadmapCreate(RoadmapBase):
    model_config = {
        "json_schema_extra": {"example": ROADMAP_CREATE_EXAMPLE}
    }


class RoadmapUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    objectives: Optional[List[Objective]] = None
    visibility: Optional[Visibility] = None

    model_config = {
        "json_schema_extra": {"example": ROADMAP_UPDATE_EXAMPLE}
    }


class Roadmap(RoadmapBase):
    roadmap_id: str
    user_id: str
    created_at: Optional[str]
    updated_at: Optional[str] = None

    model_config = {
        "json_schema_extra": {"example": ROADMAP_READ_EXAMPLE}
    }


class RoadmapResponse(BaseResponse[Roadmap]):
    pass


RoadmapPaginatedResponse = PaginatedResponse[Roadmap]
