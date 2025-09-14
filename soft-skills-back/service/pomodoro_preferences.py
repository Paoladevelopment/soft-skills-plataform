"""
Service layer for Pomodoro Preferences operations
"""
from uuid import UUID
from sqlmodel import Session, select
from datetime import datetime, timezone

from model.pomodoro_preferences import PomodoroPreferences
from schema.pomodoro_preferences import (
    PomodoroPreferencesUpdate, 
    PomodoroPreferencesRead,
    PomodoroConfiguration
)
from utils.errors import handle_db_error


class PomodoroPreferencesService:
    """Service for managing user pomodoro preferences"""
    
    FALLBACK_POMODORO_LENGTH = 60 
    
    def get_user_preferences(self, user_id: UUID, session: Session) -> PomodoroPreferences | None:
        """
        Get user's pomodoro preferences entity.
        Returns the preferences entity if exists, None otherwise.
        """
        try:
            statement = select(PomodoroPreferences).where(PomodoroPreferences.user_id == user_id)
            return session.exec(statement).first()
                
        except Exception as err:
            handle_db_error(err, "get_user_preferences", error_type="query")
    
    def get_user_preferences_status(self, user_id: UUID, session: Session) -> PomodoroConfiguration:
        """
        Get user's pomodoro preferences configuration.
        Returns configured=true with preferences if exists, or configured=false with fallback.
        """
        try:
            preferences = self.get_user_preferences(user_id, session)
            
            if preferences:
                preferences_read = PomodoroPreferencesRead.model_validate(preferences)
                return PomodoroConfiguration(
                    configured=True,
                    effective_pomodoro_length_minutes=preferences.pomodoro_length_minutes,
                    preferences=preferences_read
                )
            
            return PomodoroConfiguration(
                configured=False,
                effective_pomodoro_length_minutes=self.FALLBACK_POMODORO_LENGTH,
                preferences=None
            )
                
        except Exception as err:
            handle_db_error(err, "get_user_preferences_status", error_type="query")
    
    def create_or_update_preferences(
        self, 
        user_id: UUID, 
        preferences_data: PomodoroPreferencesUpdate, 
        session: Session
    ) -> tuple[PomodoroPreferencesRead, bool]:
        """
        Create or update user's pomodoro preferences.
        
        Returns:
            tuple: (preferences, is_created) where is_created=True if new record was created
        """
        try:
            existing_preferences = self.get_user_preferences(user_id, session)
            
            if existing_preferences:
                for field, value in preferences_data.model_dump(exclude_unset=True).items():
                    setattr(existing_preferences, field, value)
                
                existing_preferences.updated_at = datetime.now(timezone.utc)
                session.commit()
                
                return PomodoroPreferencesRead.model_validate(existing_preferences), False
            
            new_preferences = PomodoroPreferences(
                user_id=user_id,
                **preferences_data.model_dump()
            )
            
            session.add(new_preferences)
            session.commit()
            
            return PomodoroPreferencesRead.model_validate(new_preferences), True
                
        except Exception as err:
            session.rollback()
            handle_db_error(err, "create_or_update_preferences", error_type="commit")
