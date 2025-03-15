from enum import Enum


class Status(str, Enum):
  NOT_STARTED = "not_started"
  IN_PROGRESS = "in_progress"
  COMPLETED = "completed"
  PAUSED = "paused"