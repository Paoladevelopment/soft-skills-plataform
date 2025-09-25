from datetime import datetime, timezone
from uuid import UUID
from sqlmodel import SQLModel, Field, TIMESTAMP


class TeamMemberBase(SQLModel):
    joined_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )


class TeamMember(TeamMemberBase, table=True):
    __tablename__ = "listening_team_member"
    
    team_id: UUID = Field(
        primary_key=True,
        foreign_key="listening_team.id"
    )
    user_id: UUID = Field(
        primary_key=True,
        foreign_key="users.user_id"
    )
    joined_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_type=TIMESTAMP(timezone=True)
    )
