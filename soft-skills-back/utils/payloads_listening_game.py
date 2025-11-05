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
    "id": "a1b2c3d4-5678-90ef-gh12-3456789abcd",
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
    "audio_url": "https://storage.supabase.co/audio/challenge_001.mp3",
    "config": CURRENT_ROUND_CONFIG_EXAMPLE,
    "current_round": 1,
    "play_mode": "focus",
    "prompt_type": "descriptive",
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
    "audio_url": "https://storage.supabase.co/audio/challenge_002.mp3",
    "config": CURRENT_ROUND_CONFIG_EXAMPLE,
    "play_mode": "paraphrase",
    "prompt_type": "instructional",
    "mode_payload": {
        "instruction": "Paraphrase the audio content in your own words."
    }
}