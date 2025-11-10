"""
Payload examples for SelfEvaluation endpoints
"""

SELF_EVALUATION_CREATED_EXAMPLE = {
    "evaluation_id": "550e8400-e29b-41d4-a716-446655440000",
    "task_id": "123e4567-e89b-12d3-a456-426614174000",
    "created_at": "2024-06-15T14:30:00Z"
}

SELF_EVALUATION_CREATE_EXAMPLE = {
    "task_id": "123e4567-e89b-12d3-a456-426614174000",
    "study_place": "HOME_DESK",
    "time_of_day": "AFTERNOON",
    "noise_level": "QUIET",
    "collaboration_mode": "SOLO",
    "learning_intention": "I want to understand the core concepts of machine learning algorithms and how they apply to real-world problems. My goal is to be able to explain the differences between supervised and unsupervised learning.",
    "what_went_well": "I was able to focus well during the first hour. The examples in the textbook were clear and helped me visualize the concepts. I also found a great video that explained gradient descent in a way that finally clicked for me.",
    "challenges_encountered": "I struggled with the mathematical notation in the later sections. Some of the formulas were confusing, and I had to re-read them multiple times. I also got distracted by notifications on my phone a couple of times.",
    "improvement_plan": "Next time, I'll put my phone in another room and set specific time blocks for reading. I'll also try to work through the math problems step-by-step instead of just reading them. Maybe I should find a study group to discuss the concepts.",
    "perceived_difficulty": "MODERATE",
    "concentration_level": 7,
    "mood": "CALM",
    "knowledge_connection": True,
    "learning_methods": ["PRACTICE", "NOTE_TAKING", "SUMMARIZATION"]
}

SELF_EVALUATION_READ_EXAMPLE = {
    "evaluation_id": "550e8400-e29b-41d4-a716-446655440000",
    "task_id": "123e4567-e89b-12d3-a456-426614174000",
    "user_id": "789e0123-e45b-67c8-d901-234567890abc",
    "study_place": "HOME_DESK",
    "time_of_day": "AFTERNOON",
    "noise_level": "QUIET",
    "collaboration_mode": "SOLO",
    "learning_intention": "I want to understand the core concepts of machine learning algorithms and how they apply to real-world problems. My goal is to be able to explain the differences between supervised and unsupervised learning.",
    "what_went_well": "I was able to focus well during the first hour. The examples in the textbook were clear and helped me visualize the concepts. I also found a great video that explained gradient descent in a way that finally clicked for me.",
    "challenges_encountered": "I struggled with the mathematical notation in the later sections. Some of the formulas were confusing, and I had to re-read them multiple times. I also got distracted by notifications on my phone a couple of times.",
    "improvement_plan": "Next time, I'll put my phone in another room and set specific time blocks for reading. I'll also try to work through the math problems step-by-step instead of just reading them. Maybe I should find a study group to discuss the concepts.",
    "perceived_difficulty": "MODERATE",
    "concentration_level": 7,
    "mood": "CALM",
    "knowledge_connection": True,
    "learning_methods": ["PRACTICE", "NOTE_TAKING", "SUMMARIZATION"],
    "created_at": "2024-06-15T14:30:00Z"
}

