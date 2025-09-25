from uuid import UUID
from sqlmodel import SQLModel, Field, Column, JSON
from enums.listening_game import PromptType


class RecentTypesCacheBase(SQLModel):
    recent_types: list[PromptType] = Field(default_factory=list)


class RecentTypesCache(RecentTypesCacheBase, table=True):
    __tablename__ = "listening_recent_types_cache"
    
    game_id: UUID = Field(
        primary_key=True,
        foreign_key="listening_game.id"
    )
    team_id: UUID = Field(
        primary_key=True,
        foreign_key="listening_team.id"
    )
    recent_types: list[PromptType] = Field(
        default_factory=list,
        sa_column=Column(JSON)
    )
