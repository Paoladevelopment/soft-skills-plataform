from enum import Enum


class TaskType(str, Enum):
    READING = "reading"
    PRACTICE = "practice"
    WRITING = "writing"
    RESEARCH = "research"
    LISTENING = "listening"
    DISCUSSION = "discussion"
    PROBLEM_SOLVING = "problem_solving"
    EXPERIMENTING = "experimenting"
    TEACHING = "teaching"
    OTHER = "other"
