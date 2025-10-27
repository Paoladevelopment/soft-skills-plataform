from enum import Enum

class PromptType(str, Enum):
    descriptive = "descriptive"
    historical_event = "historical_event"
    instructional = "instructional"
    dialogue = "dialogue"
    narrated_dialogue = "narrated_dialogue"

class Difficulty(str, Enum):
    easy = "easy"
    intermediate = "intermediate"
    hard = "hard"

class AudioStorage(str, Enum):
    s3 = "s3"
    supabase = "supabase"
    gcs = "gcs"
    none = "none"

class PlayMode(str, Enum):
    focus = "focus"
    cloze = "cloze"
    paraphrase = "paraphrase"
    summarize = "summarize"
    clarify = "clarify"

    def __str__(self) -> str:
        return self.value

class AudioEffects(str, Enum):
    reverb = "reverb"
    echo = "echo"
    background_noise = "background_noise"
    speed_variation = "speed_variation"

    def __str__(self) -> str:
        return self.value

class AudioLength(str, Enum):
    short = "short"          
    medium = "medium"          
    long = "long"           

class GameStatus(str, Enum):
    pending = "pending"
    in_progress = "in_progress"
    paused = "paused"
    completed = "completed"
    cancelled = "cancelled"


class GameRoundStatus(str, Enum):
    queued = "queued"
    processing = "processing"
    ready = "ready"
    in_progress = "in_progress"
    completed = "completed"
    failed = "failed"


