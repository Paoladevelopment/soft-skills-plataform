from typing import Dict, List
from pydantic import BaseModel, field_validator
from pydantic import UUID4
from sqlmodel import Field, SQLModel

from enums.common import Status
from schema.base import BaseResponse
from schema.task import TaskSummary


class KanbanColumnResponse(BaseModel):
    """Response schema for a single Kanban column"""
    page: int
    per_page: int
    total: int
    total_pages: int
    has_next: bool
    items: List[TaskSummary]


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
    items: List[TaskSummary]


class KanbanMoveRequest(SQLModel):
    """Request schema for moving tasks in Kanban board"""
    task_id: UUID4 = Field(description="ID de la tarea a mover")
    from_column: Status = Field(description="Estado de la columna actual")
    to_column: Status = Field(description="Estado de la columna destino")
    new_position: int = Field(ge=0, description="Posición de índice basada en 0 en la columna destino")
    reason: str | None = Field(default=None, description="Razón requerida para movimientos de regresión")

    @field_validator('reason')
    @classmethod
    def validate_reason_for_regression(cls, v, info):
        if hasattr(info, 'data') and 'from_column' in info.data and 'to_column' in info.data:
            from_col = info.data['from_column']
            to_col = info.data['to_column']
            
            rank_map = {
                Status.NOT_STARTED: 0,
                Status.IN_PROGRESS: 1,
                Status.PAUSED: 1,
                Status.COMPLETED: 2
            }
            
            if rank_map.get(to_col, 0) < rank_map.get(from_col, 0):
                if not v or not v.strip():
                    raise ValueError("Se requiere una razón para movimientos de regresión")
        
        return v


class TaskMoveInfo(SQLModel):
    """Task position and status information"""
    id: UUID4
    status: str
    column: str
    position: int


class KanbanMoveResponse(BaseResponse[TaskMoveInfo]):
    """Response schema for kanban move operation"""
    old: TaskMoveInfo = Field(description="Posición y estado previos de la tarea")
