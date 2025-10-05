from enum import Enum


class RoomStatus(str, Enum):
    lobby = "lobby"
    active = "active"
    finished = "finished"
    archived = "archived"

    def __str__(self) -> str:
        return self.value


class GameStatus(str, Enum):
    active = "active"
    finished = "finished"


class RoundStatus(str, Enum):
    pending = "pending"
    in_progress = "in_progress"
    timeout = "timeout"
    answered = "answered"
    scored = "scored"
    finished = "finished"


class RoundTeamStatus(str, Enum):
    pending = "pending"
    in_progress = "in_progress"
    answered = "answered"
    timeout = "timeout"
    scored = "scored"


class PromptType(str, Enum):
    descriptive = "descriptive"
    conversational = "conversational"
    historical_event = "historical_event"
    instructional = "instructional"
    dialogue = "dialogue"
    narrated_dialogue = "narrated_dialogue"


class AudioLength(str, Enum):
    short = "short"
    medium = "medium"
    long = "long"


class Difficulty(str, Enum):
    easy = "easy"
    intermediate = "intermediate"
    hard = "hard"


class PenaltyReason(str, Enum):
    forbidden_word = "forbidden_word"
    replay_limit = "replay_limit"
    timeout = "timeout"


class AudioStorage(str, Enum):
    s3 = "s3"
    supabase = "supabase"
    gcs = "gcs"
    none = "none"


class VoiceProvider(str, Enum):
    discord = "discord"
    jitsi = "jitsi"
    custom = "custom"


class TeamAssignmentMode(str, Enum):
    manual = "manual"
    random = "random"
