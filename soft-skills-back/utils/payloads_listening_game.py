GAME_SESSION_CREATE_EXAMPLE = {
    "name": "Morning Listening Practice"
}

GAME_SESSION_CREATE_FULL_EXAMPLE = {
    "name": "Advanced Listening Challenge",
    "config": {
        "total_rounds": 7,
        "max_replays_per_round": 2,
        "difficulty": "hard",
        "selected_modes": ["focus", "cloze", "paraphrase", "summarize"],
        "allowed_types": ["descriptive", "instructional"],
        "audio_effects": {
            "reverb": 0.2,
            "echo": 0.1,
            "background_noise": 0.05,
            "speed_variation": 0.1
        }
    }
}

GAME_SESSION_READ_EXAMPLE = {
    "id": "a1b2c3d4-5678-90ef-gh12-3456789abcd",
    "name": "Morning Listening Practice",
    "user_id": "123e4567-e89b-12d3-a456-426614174000",
    "status": "pending",
    "current_round": 1,
    "total_score": 0.0,
    "created_at": "2025-10-26T08:30:00Z",
    "started_at": None,
    "finished_at": None
}

GAME_SESSION_DETAIL_EXAMPLE = {
    "id": "a1b2c3d4-5678-90ef-gh12-3456789abcd",
    "name": "Morning Listening Practice",
    "user_id": "123e4567-e89b-12d3-a456-426614174000",
    "status": "active",
    "current_round": 3,
    "total_score": 245.5,
    "created_at": "2025-10-26T08:30:00Z",
    "started_at": "2025-10-26T08:32:00Z",
    "finished_at": None,
    "config": {
        "total_rounds": 5,
        "max_replays_per_round": 2,
        "difficulty": "easy",
        "response_time_limits": {
            "focus": 30,
            "cloze": 45,
            "paraphrase": 60,
            "summarize": 90,
            "clarify": 45
        },
        "selected_modes": ["focus", "cloze", "paraphrase"],
        "allowed_types": ["descriptive", "instructional"],
        "audio_effects": {
            "reverb": 0.2,
            "echo": 0.1,
            "background_noise": 0.05,
            "speed_variation": 0.1
        }
    }
}

GAME_SESSION_CONFIG_CREATE_EXAMPLE = {
    "total_rounds": 5,
    "max_replays_per_round": 2,
    "difficulty": "intermediate",
    "selected_modes": ["focus", "cloze", "paraphrase", "summarize"],
    "allowed_types": ["descriptive", "historical_event", "instructional"],
    "audio_effects": {
        "reverb": 0.3,
        "echo": 0.15,
        "background_noise": 0.1,
        "speed_variation": 0.15
    }
}

GAME_SESSION_CONFIG_READ_EXAMPLE = {
    "total_rounds": 5,
    "max_replays_per_round": 2,
    "difficulty": "intermediate",
    "response_time_limits": {
        "focus": 25,
        "cloze": 40,
        "paraphrase": 55,
        "summarize": 85,
        "clarify": 40
    },
    "selected_modes": ["focus", "cloze", "paraphrase", "summarize"],
    "allowed_types": ["descriptive", "historical_event", "instructional"],
    "audio_effects": {
        "reverb": 0.3,
        "echo": 0.15,
        "background_noise": 0.1,
        "speed_variation": 0.15
    }
}

GAME_SESSION_SUMMARY_EXAMPLE = {
    "game_session_id": "a1b2c3d4-5678-90ef-gh12-3456789abcd",
    "name": "Morning Listening Practice",
    "status": "finished",
    "current_round": 5,
    "total_score": 487.5,
    "created_at": "2025-10-26T08:30:00Z"
}

GAME_SESSION_UPDATE_EXAMPLE = {
    "name": "Evening Listening Practice",
    "status": "active"
}

GAME_SESSION_CONFIG_UPDATE_EXAMPLE = {
    "total_rounds": 7,
    "difficulty": "hard",
    "selected_modes": ["focus", "cloze", "paraphrase", "summarize", "clarify"]
}

CHALLENGE_CREATE_EXAMPLE = {
    "play_mode": "focus",
    "prompt_type": "descriptive",
    "difficulty": "easy",
    "audio_length": "medium",
    "locale": "en"
}

CHALLENGE_READ_EXAMPLE = {
    "challenge_id": "a1b2c3d4-5678-90ef-gh12-3456789abcd",
    "play_mode": "focus",
    "prompt_type": "descriptive",
    "difficulty": "easy",
    "audio_url": "https://storage.supabase.co/audio/challenge_001.mp3",
    "audio_text": "Hello, welcome to our conversation about sustainable living. Today we'll discuss practical ways to reduce your environmental footprint.",
    "created_at": "2025-10-26T08:30:00Z"
}

CHALLENGE_AUDIO_RESPONSE_EXAMPLE = {
    "audio_url": "https://cdn.example.com/challenges-audio/123e4567-e89b-12d3-a456-426614174000.mp3"
}

CURRENT_ROUND_CONFIG_EXAMPLE = {
    "max_replays_per_round": 2,
    "audio_effects": {
        "reverb": 0.3,
        "echo": 0.15,
        "background_noise": 0.1,
        "speed_variation": 0.15
    }
}

CURRENT_ROUND_RESPONSE_EXAMPLE = {
    "round_id": "550e8400-e29b-41d4-a716-446655440000",
    "audio_url": "https://storage.supabase.co/audio/challenge_001.mp3",
    "config": CURRENT_ROUND_CONFIG_EXAMPLE,
    "current_round": 1,
    "status": "served",
    "play_mode": "focus",
    "prompt_type": "descriptive",
    "score": None,
    "max_score": 10.0,
    "mode_payload": {
        "question": "What is the main topic discussed in the audio?",
        "answer_choices": [
            "Sustainable living practices",
            "Environmental policies",
            "Renewable energy sources",
            "Climate change effects"
        ],
        "instruction": "Listen to the audio and select the correct answer to the question."
    }
}

CURRENT_ROUND_RESPONSE_PARAPHRASE_EXAMPLE = {
    "round_id": "550e8400-e29b-41d4-a716-446655440001",
    "audio_url": "https://storage.supabase.co/audio/challenge_002.mp3",
    "config": CURRENT_ROUND_CONFIG_EXAMPLE,
    "current_round": 1,
    "status": "served",
    "play_mode": "paraphrase",
    "prompt_type": "instructional",
    "score": None,
    "max_score": 10.0,
    "mode_payload": {
        "instruction": "Paraphrase the audio content in your own words."
    }
}

# Answer payload examples for each play mode
ATTEMPT_SUBMISSION_PARAPHRASE_EXAMPLE = {
    "answer_payload": {
        "paraphrase": "The story discusses how ancient civilizations developed advanced agricultural techniques that allowed them to sustain large populations and build complex societies."
    },
    "idempotency_key": "unique-key-123",
    "client_elapsed_ms": 45000
}

ATTEMPT_SUBMISSION_CLARIFY_EXAMPLE = {
    "answer_payload": {
        "questions": ["¿Cuál es el regalo al que hacen referencia?", "¿Cuándo ocurre el evento?"]
    },
    "idempotency_key": "unique-key-123",
    "client_elapsed_ms": 45000
}

ATTEMPT_SUBMISSION_SUMMARIZE_EXAMPLE = {
    "answer_payload": {
        "summary": "The main points of the audio discuss how ancient civilizations developed advanced agricultural techniques that allowed them to sustain large populations and build complex societies."
    },
    "idempotency_key": "unique-key-123",
    "client_elapsed_ms": 45000
}

ATTEMPT_SUBMISSION_FOCUS_EXAMPLE = {
    "answer_payload": {
        "selected_index": 2
    },
    "idempotency_key": "unique-key-123",
    "client_elapsed_ms": 45000
}

ATTEMPT_SUBMISSION_CLOZE_EXAMPLE = {
    "answer_payload": {
        "blanks": ["agriculture", "civilizations", "populations"]
    },
    "idempotency_key": "unique-key-123",
    "client_elapsed_ms": 45000
}

ATTEMPT_SUBMISSION_RESPONSE_EXAMPLE = {
    "round_number": 1,
    "is_correct": True,
    "score": 8.5,
    "feedback_short": "Excellent paraphrase!",
    "client_elapsed_ms": 45000,
    "can_advance": True
}

ROUND_ADVANCE_RESPONSE_EXAMPLE = {
    "current_round": 2
}

SESSION_COMPLETED_RESPONSE_EXAMPLE = {
    "session_completed": True,
    "final_score": 85.5
}

GAME_SESSION_START_RESPONSE_EXAMPLE = {
    "session_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "status": "in_progress",
    "current_round": 1,
    "started_at": "2025-11-06T22:46:21Z",
    "round": {
        "round_number": 1,
        "status": "queued",
        "play_mode": None,
        "prompt_type": None,
        "score": None,
        "max_score": 10,
        "game_round_id": "7996773b-52e0-4e68-9d02-e520f4e34206"
    }
}