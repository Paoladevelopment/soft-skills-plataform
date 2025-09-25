ROOM_CREATE_EXAMPLE = {
    "owner_user_id": "123e4567-e89b-12d3-a456-426614174000",
    "config": {
        "rounds_total": 5,
        "round_time_limit_sec": 90,
        "listener_max_playbacks": 2,
        "allowed_types": ["descriptive", "conversational", "soundscape"],
        "difficulty": "intermediate",
        "audio_effects": {"reverb": 0.3, "echo": 0.1}
    }
}

ROOM_READ_EXAMPLE = {
    "id": "a1b2c3d4-5678-90ef-gh12-3456789abcd",
    "owner_user_id": "123e4567-e89b-12d3-a456-426614174000",
    "status": "lobby",
    "created_at": "2025-09-22T10:30:00Z",
    "started_at": None,
    "finished_at": None
}

ROOM_DETAIL_EXAMPLE = {
    "id": "a1b2c3d4-5678-90ef-gh12-3456789abcd",
    "owner_user_id": "123e4567-e89b-12d3-a456-426614174000",
    "status": "active",
    "created_at": "2025-09-22T10:30:00Z",
    "started_at": "2025-09-22T10:35:00Z",
    "finished_at": None,
    "config": {
        "rounds_total": 5,
        "round_time_limit_sec": 90,
        "listener_max_playbacks": 2,
        "allowed_types": ["descriptive", "conversational"],
        "difficulty": "intermediate",
        "audio_effects": {}
    },
    "teams": [
        {"id": "team-1", "name": "Alpha Squad", "member_count": 3},
        {"id": "team-2", "name": "Beta Force", "member_count": 2}
    ]
}

ROUND_READ_EXAMPLE = {
    "id": "round-123",
    "game_id": "game-456",
    "round_number": 2,
    "status": "in_progress",
    "started_at": "2025-09-22T10:45:00Z",
    "deadline_at": "2025-09-22T10:46:30Z",
    "ended_at": None
}

ROUND_TIMELINE_EXAMPLE = {
    "round_id": "round-123",
    "events": [
        {"timestamp": "2025-09-22T10:45:00Z", "type": "round_started"},
        {"timestamp": "2025-09-22T10:45:15Z", "type": "audio_generated"},
        {"timestamp": "2025-09-22T10:45:30Z", "type": "first_message_sent"}
    ]
}

ROUND_TEAM_LISTENER_VIEW_EXAMPLE = {
    "round_team_id": "rt-789",
    "forbidden_words": ["computer", "technology", "digital"],
    "remaining_playbacks": 1,
    "audio": {
        "url": "https://storage.example.com/audio/clip-123.mp3",
        "storage": "s3",
        "voice_id": "voice_sarah_001",
        "model_id": "tts_model_v2",
        "output_format": "mp3"
    }
}

ROUND_TEAM_DECODER_VIEW_EXAMPLE = {
    "round_team_id": "rt-789",
    "listener_messages": [
        {"content": "A device you use every day", "created_at": "2025-09-22T10:45:45Z"},
        {"content": "Has a screen and keyboard", "created_at": "2025-09-22T10:45:50Z"}
    ],
    "answer_choices": ["laptop", "smartphone", "tablet", "desktop"],
    "time_left_sec": 45,
    "voice_room_url": "https://meet.jit.si/listening-game-rt789"
}

LISTENER_MESSAGE_CREATE_EXAMPLE = {
    "content": "A rectangular device with buttons and a screen"
}

DECODER_ANSWER_CREATE_EXAMPLE = {
    "selected_answer": "laptop"
}

ROUND_TEAM_SCORE_READ_EXAMPLE = {
    "id": "score-123",
    "round_team_id": "rt-789",
    "is_correct": True,
    "base_points": 100,
    "speed_bonus": 25,
    "penalties": -10,
    "total_points": 115
}

LEADERBOARD_READ_EXAMPLE = {
    "game_id": "game-456",
    "teams": [
        {
            "team_id": "team-1",
            "team_name": "Alpha Squad",
            "points_total": 340,
            "rank": 1
        },
        {
            "team_id": "team-2", 
            "team_name": "Beta Force",
            "points_total": 285,
            "rank": 2
        }
    ]
}

EVENT_LOG_READ_EXAMPLE = {
    "id": "event-123",
    "game_id": "game-456",
    "round_id": "round-123",
    "round_team_id": "rt-789",
    "actor_user_id": "123e4567-e89b-12d3-a456-426614174000",
    "type": "answer_submitted",
    "payload": {"selected_answer": "laptop", "latency_ms": 2300},
    "occurred_at": "2025-09-22T10:46:15Z"
}
