from typing import Dict, List
from pydantic import BaseModel

from schema.task import TaskRead


class KanbanColumnResponse(BaseModel):
    """Response schema for a single Kanban column"""
    page: int
    per_page: int
    total: int
    total_pages: int
    has_next: bool
    items: List[TaskRead]


class KanbanBoardResponse(BaseModel):
    """Response schema for the full Kanban board"""
    columns: Dict[str, KanbanColumnResponse]


class KanbanColumnPaginatedResponse(BaseModel):
    """Response schema for paginated column data"""
    status: str
    page: int
    per_page: int
    total: int
    total_pages: int
    has_next: bool
    items: List[TaskRead]
