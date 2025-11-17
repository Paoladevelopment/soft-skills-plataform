from uuid import UUID, uuid4
from datetime import datetime, timezone
from typing import Optional

from enums.resource import ResourceType
from sqlmodel import TIMESTAMP, Field, Relationship, SQLModel


class TaskResourceBase(SQLModel):
    task_id: UUID
    type: ResourceType
    title: str
    link: str


class TaskResource(TaskResourceBase, table=True):
    __tablename__ = "task_resources"
    resource_id: UUID = Field(default_factory=uuid4, primary_key=True)
    task_id: UUID = Field(foreign_key="tasks.task_id")
    created_at: datetime | None = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_type=TIMESTAMP(timezone=True)
    )
    updated_at: datetime | None = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column_kwargs={
            "onupdate": lambda: datetime.now(timezone.utc),
        },
        sa_type=TIMESTAMP(timezone=True),
    )
    task: Optional["Task"] = Relationship(back_populates="resources")

