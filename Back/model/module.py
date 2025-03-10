from datetime import datetime, timezone
from typing import List

from sqlalchemy import JSON, Column
from sqlmodel import TIMESTAMP, Field, SQLModel

from enums.module import ModuleStatus, SkillCategory


class ModuleBase(SQLModel):
    title: str
    category: SkillCategory
    status: ModuleStatus
    description: str
    image_url: str | None = Field(default=None)
    objective: str
    tags: List[str] = Field(default_factory=list)


class Module(ModuleBase, table=True):
    __tablename__ = "modules"
    id: int | None = Field(default=None, primary_key=True)
    created_at: datetime | None = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_type=TIMESTAMP(timezone = True)
        )
    updated_at: datetime | None = Field(
      default_factory=lambda: datetime.now(timezone.utc),
      sa_column_kwargs={
          "onupdate": lambda: datetime.now(timezone.utc),
      },
      sa_type=TIMESTAMP(timezone=True),
    )
    tags: List[str] = Field(default_factory=list, sa_column=Column(JSON))