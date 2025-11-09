from nosql_models.roadmap import Roadmap, RoadmapSummary, Objective
from typing import List, Optional, TypeVar
from pydantic import BaseModel
from enums.roadmap import Visibility
from nosql_models.roadmap import Layout
from schema.base import BaseResponse
from utils.payloads import (ROADMAP_CREATE_EXAMPLE, ROADMAP_UPDATE_EXAMPLE)

T = TypeVar("T")

class RoadmapBase(BaseModel):
    title: str
    description: str

class RoadmapCreate(RoadmapBase):
    model_config = {
        "json_schema_extra": {"example": ROADMAP_CREATE_EXAMPLE}
    }

class RoadmapUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    objectives: Optional[List[Objective]] = None
    visibility: Optional[Visibility] = None
    layout: Optional[Layout] = None

    model_config = {
        "json_schema_extra": {"example": ROADMAP_UPDATE_EXAMPLE}
    }

class PaginatedRoadmapsResponse(BaseModel):
    data: List[RoadmapSummary]
    total: int

class RoadmapResponse(BaseResponse[Roadmap]):
    pass

def roadmap_serializer(model: Roadmap) -> dict:
    return model.model_dump()

def to_roadmap_model(doc: dict) -> Roadmap:
    doc["roadmap_id"] = str(doc.pop("_id"))
    return Roadmap(**doc)


def to_roadmap_summary_model(doc: dict) -> RoadmapSummary:
    total_tasks = 0
    for obj in doc.get("objectives", []):
        tasks = obj.get("tasks", [])
        total_tasks += len(tasks)

    return RoadmapSummary(
        roadmap_id=str(doc["_id"]),
        title=doc.get("title", ""),
        username=doc.get("username", ""),
        description=doc.get("description"),
        created_at=doc.get("created_at"),  
        steps_count=total_tasks,
        visibility=doc.get("visibility", "private")
    )
