from enum import Enum

class Visibility(str, Enum):
    private = "private"
    public = "public"
    unlisted = "unlisted"