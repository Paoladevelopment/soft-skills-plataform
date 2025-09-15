import uuid
from datetime import datetime, timezone
from uuid import UUID


from sqlmodel import TIMESTAMP, Field, SQLModel


class PomodoroPreferencesBase(SQLModel):
    pomodoro_length_minutes: int = Field(default=60)
    short_break_minutes: int = Field(default=5)
    long_break_minutes: int = Field(default=15)
    cycles_per_long_break: int = Field(default=4)
    auto_start_breaks: bool = Field(default=True)
    auto_start_work: bool = Field(default=False)
    sound_enabled: bool = Field(default=True)
    volume: float = Field(default=0.7, ge=0.0, le=1.0)



class PomodoroPreferences(PomodoroPreferencesBase, table=True):
    __tablename__ = "pomodoro_preferences"
    pomodoro_preferences_id: UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: UUID | None = Field(default=None, foreign_key="users.user_id")
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
