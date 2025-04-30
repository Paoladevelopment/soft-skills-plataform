from pydantic import BaseModel, HttpUrl
from enums.resource import ResourceType
from enums.roadmap import Visibility
from bson import ObjectId
from typing import List, Optional

class Resource(BaseModel):
    type: ResourceType
    title: str
    url: HttpUrl

class Task(BaseModel):
    task_id: str
    title: str
    order_index: int
    resources: list[Resource]

class Objective(BaseModel):
    objective_id: str
    title: str
    order_index: int
    tasks: list[Task]

class Roadmap(BaseModel):
    roadmap_id: str
    title: str
    description: str
    objectives: List[Objective]
    user_id: str
    created_at: Optional[str]
    updated_at: Optional[str]
    visibility: Visibility = Visibility.private

    model_config = {
        "arbitrary_types_allowed": True,
        "json_encoders": {
            ObjectId: str,
        }
    }

class RoadmapSummary(BaseModel):
    roadmap_id: str
    title: str
    description: Optional[str] = None
    created_at: Optional[str] = None
    steps_count: int