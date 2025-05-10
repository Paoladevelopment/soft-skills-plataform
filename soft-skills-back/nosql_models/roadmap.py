from pydantic import BaseModel, HttpUrl, Field, model_validator
from enums.resource import ResourceType
from enums.roadmap import Visibility, LayoutNodeType
from enums.task.task_type import TaskType 
from bson import ObjectId
from typing import List, Optional, Union

class Resource(BaseModel):
    type: ResourceType
    title: str
    url: HttpUrl

class Task(BaseModel):
    task_id: str
    title: str
    order_index: int
    description: Optional[str] = None
    type: Optional[TaskType] = None
    content_title: Optional[str] = None
    resources: List[Resource] = Field(default_factory=list)
    comments: List[str] = Field(default_factory=list)

class Objective(BaseModel):
    objective_id: str
    title: str
    order_index: int
    description: Optional[str] = None
    content_title: Optional[str] = None
    resources: List[Resource] = Field(default_factory=list)
    comments: List[str] = Field(default_factory=list)
    tasks: List[Task] = Field(default_factory=list)

class ObjectiveNodeData(BaseModel):
    title: str
    total_tasks: Optional[int] = None
    font_size: Optional[str] = None
    background_color: Optional[str] = None
    width: Optional[int] = None
    height: Optional[int] = None

class TaskNodeData(BaseModel):
    title: str
    font_size: Optional[str] = None
    background_color: Optional[str] = None
    width: Optional[int] = None
    height: Optional[int] = None

class Position(BaseModel):
    x: float = Field(..., description="X coordinate in the canvas")
    y: float = Field(..., description="Y coordinate in the canvas")


class LayoutNode(BaseModel):
    id: str
    type: LayoutNodeType
    position: Position
    data: Union[ObjectiveNodeData, TaskNodeData]

class LayoutEdge(BaseModel):
    id: str
    source: str
    source_handle: Optional[str] = None
    target: str
    target_handle: Optional[str] = None

class Layout(BaseModel):
    nodes: List[LayoutNode]
    edges: List[LayoutEdge]

class Roadmap(BaseModel):
    roadmap_id: str
    title: str
    description: str
    objectives: List[Objective]
    layout: Optional[Layout] = None
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