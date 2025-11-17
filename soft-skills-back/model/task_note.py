from uuid import UUID, uuid4
from datetime import datetime, timezone
from typing import Optional

from sqlalchemy import Text
from sqlmodel import TIMESTAMP, Field, Relationship, SQLModel


class TaskNoteBase(SQLModel):
    task_id: UUID
    title: str
    content: str = Field(sa_type=Text)


class TaskNote(TaskNoteBase, table=True):
    __tablename__ = "task_notes"
    note_id: UUID = Field(default_factory=uuid4, primary_key=True)
    task_id: UUID = Field(foreign_key="tasks.task_id")
    content: str = Field(sa_type=Text)
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
    task: Optional["Task"] = Relationship(back_populates="notes")

