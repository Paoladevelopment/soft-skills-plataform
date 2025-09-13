from typing import Dict, List
from pydantic import BaseModel, validator
from pydantic import UUID4
from sqlmodel import Field, SQLModel

from enums.common import Status
from schema.base import BaseResponse
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


class KanbanMoveRequest(SQLModel):
    """Request schema for moving tasks in Kanban board"""
    task_id: UUID4 = Field(description="ID of the task to move")
    from_column: Status = Field(description="Current column status")
    to_column: Status = Field(description="Destination column status")
    new_position: int = Field(ge=0, description="0-based index position in destination column")
    reason: str | None = Field(default=None, description="Required reason for regression moves")

    @validator('reason')
    def validate_reason_for_regression(cls, v, values):
        if 'from_column' in values and 'to_column' in values:
            from_col = values['from_column']
            to_col = values['to_column']
            
            rank_map = {
                Status.NOT_STARTED: 0,
                Status.IN_PROGRESS: 1,
                Status.PAUSED: 1,
                Status.COMPLETED: 2
            }
            
            if rank_map.get(to_col, 0) < rank_map.get(from_col, 0):
                if not v or not v.strip():
                    raise ValueError("Reason is required for regression moves")
        
        return v


class TaskMoveInfo(SQLModel):
    """Task position and status information"""
    id: UUID4
    status: str
    column: str
    position: int


class KanbanMoveResponse(BaseResponse[TaskMoveInfo]):
    """Response schema for kanban move operation"""
    old: TaskMoveInfo = Field(description="Previous task position and status")
