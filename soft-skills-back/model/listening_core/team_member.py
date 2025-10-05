from uuid import UUID
from datetime import datetime, timezone
from sqlmodel import SQLModel, Field, TIMESTAMP

class TeamMember(SQLModel, table=True):
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
