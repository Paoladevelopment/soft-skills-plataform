"""
Payload examples for Pomodoro Preferences endpoints
"""

POMODORO_PREFERENCES_CREATE_EXAMPLE = {
    "pomodoro_length_minutes": 25,
    "short_break_minutes": 5,
    "long_break_minutes": 15,
    "cycles_per_long_break": 4,
    "auto_start_breaks": True,
    "auto_start_work": False,
    "sound_enabled": True,
    "volume": 0.7
}

POMODORO_PREFERENCES_READ_EXAMPLE = {
    "pomodoro_preferences_id": "550e8400-e29b-41d4-a716-446655440000",
    "pomodoro_length_minutes": 25,
    "short_break_minutes": 5,
    "long_break_minutes": 15,
    "cycles_per_long_break": 4,
    "auto_start_breaks": True,
    "auto_start_work": False,
    "sound_enabled": True,
    "volume": 0.7,
    "created_at": "2023-01-01T12:00:00Z",
    "updated_at": "2023-01-01T12:00:00Z"
}

POMODORO_CONFIGURATION_CONFIGURED_EXAMPLE = {
    "configured": True,
    "effective_pomodoro_length_minutes": 25,
    "preferences": {
        "pomodoro_preferences_id": "550e8400-e29b-41d4-a716-446655440000",
        "pomodoro_length_minutes": 25,
        "short_break_minutes": 5,
        "long_break_minutes": 15,
        "cycles_per_long_break": 4,
        "auto_start_breaks": True,
        "auto_start_work": False,
        "sound_enabled": True,
        "volume": 0.7,
        "created_at": "2023-01-01T12:00:00Z",
        "updated_at": "2023-01-01T12:00:00Z"
    }
}

POMODORO_CONFIGURATION_NOT_CONFIGURED_EXAMPLE = {
    "configured": False,
    "effective_pomodoro_length_minutes": 60,
    "preferences": None
}
