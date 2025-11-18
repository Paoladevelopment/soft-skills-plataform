TASK_CREATE_EXAMPLE = {
    "objective_id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Read a research paper on AI ethics",
    "description": "Read and summarize a paper on ethical considerations in AI.",
    "task_type": "reading",
    "priority": "high",
    "estimated_seconds": 5400,  # 90 minutes in seconds
    "due_date": "2024-06-15T18:00:00Z",
    "is_optional": False
}

TASK_READ_EXAMPLE = {
    "task_id": "123e4567-e89b-12d3-a456-426614174000",
    "objective_id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Read a research paper on AI ethics",
    "description": "Read and summarize a paper on ethical considerations in AI.",
    "task_type": "reading",
    "status": "completed",
    "priority": "high",
    "estimated_seconds": 5400,  # 90 minutes in seconds
    "actual_seconds": 6600,     # 110 minutes in seconds
    "pomodoro_length_seconds_snapshot": 3600,  # 60 minutes (default)
    "due_date": "2024-06-15T18:00:00Z",
    "is_optional": False,
    "created_at": "2024-06-15T10:00:00Z",
    "updated_at": "2024-06-15T12:00:00Z",
    "started_at": "2024-06-15T12:00:00Z",
    "completed_at": "2024-06-15T14:30:00Z",
    "estimated_minutes": 90.0,
    "actual_minutes": 110.0,
    "estimated_pomodoros": 1.5,  # 5400/3600 = 1.5
    "actual_pomodoros": 1.83     # 6600/3600 = 1.83
}

TASK_UPDATE_EXAMPLE = {
    "task_type": "research",
    "estimated_seconds": 7200,  # 120 minutes in seconds
    "actual_seconds": 7800  # 130 minutes in seconds
}