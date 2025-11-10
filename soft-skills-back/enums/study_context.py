from enum import Enum


class StudyPlace(str, Enum):
    HOME_DESK = "HOME_DESK"
    HOME_COMMON_AREA = "HOME_COMMON_AREA"
    OFFICE_DESK = "OFFICE_DESK"
    COWORKING = "COWORKING"
    LIBRARY = "LIBRARY"
    CLASSROOM = "CLASSROOM"
    UNIVERSITY_CAMPUS = "UNIVERSITY_CAMPUS"  # non-class study spaces on campus (cafeteria, quad, labs common areas)
    CAFE = "CAFE"
    BOOKSTORE = "BOOKSTORE"
    DORM_ROOM = "DORM_ROOM"
    DORM_COMMON_AREA = "DORM_COMMON_AREA"
    OUTDOORS = "OUTDOORS"
    TRANSIT = "TRANSIT"  # studying while commuting (bus/train/plane, passenger in car)
    OTHER = "OTHER"

    def __str__(self) -> str:
        return self.value


class PerceivedDifficulty(str, Enum):
    EASY = "EASY"
    MODERATE = "MODERATE"
    HARD = "HARD"

    def __str__(self) -> str:
        return self.value


class Mood(str, Enum):
    ENERGIZED = "ENERGIZED"        # motivated, enthusiastic
    CALM = "CALM"                  # neutral but steady
    NEUTRAL = "NEUTRAL"            # neither up nor down
    TIRED = "TIRED"                # low energy
    FRUSTRATED = "FRUSTRATED"      # stuck, annoyed
    STRESSED = "STRESSED"          # pressured or tense
    OTHER = "OTHER"

    def __str__(self) -> str:
        return self.value


class TimeOfDay(str, Enum):
    MORNING = "MORNING"
    AFTERNOON = "AFTERNOON"
    EVENING = "EVENING"
    NIGHT = "NIGHT"

    def __str__(self) -> str:
        return self.value


class NoiseLevel(str, Enum):
    QUIET = "QUIET"
    MODERATE = "MODERATE"
    NOISY = "NOISY"

    def __str__(self) -> str:
        return self.value

class CollaborationMode(str, Enum):
    SOLO = "SOLO"
    PAIR = "PAIR"
    GROUP = "GROUP"

    def __str__(self) -> str:
        return self.value


class LearningMethod(str, Enum):
    PRACTICE = "PRACTICE"
    NOTE_TAKING = "NOTE_TAKING"
    SPACED_REPETITION = "SPACED_REPETITION"
    SUMMARIZATION = "SUMMARIZATION"
    TEACH_BACK = "TEACH_BACK"
    FLASHCARDS = "FLASHCARDS"
    OTHER = "OTHER"

    def __str__(self) -> str:
        return self.value