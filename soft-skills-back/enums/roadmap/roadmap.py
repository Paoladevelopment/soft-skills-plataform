from enum import Enum

class Visibility(str, Enum):
    private = "private"
    public = "public"
    unlisted = "unlisted"

class LayoutNodeType(str, Enum):
    OBJECTIVE = "objectiveNode"
    TASK = "taskNode"