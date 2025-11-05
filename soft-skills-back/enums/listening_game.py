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
    pending = "pending" # Created, not started
    in_progress = "in_progress"  # Running; /next and /attempts allowed
    paused = "paused" # Paused by user; only resume/cancel allowed
    completed = "completed" # All rounds done or ended normally; read-only
    cancelled = "cancelled" # Ended by user or system; read-only


class GameRoundStatus(str, Enum):
    queued = "queued" # Round exists, but no challenge assigned yet
    pending = "pending" # Challenge has been assigned and its audio is confirmed to exist
    served = "served" # The round has been delivered to the client via /next
    attempted = "attempted" # The user submitted an attempt and the score is recorded

    def __str__(self) -> str:
        return self.value



