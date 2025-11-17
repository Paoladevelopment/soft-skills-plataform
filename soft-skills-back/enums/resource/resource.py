from enum import Enum

class ResourceType(str, Enum):
    ARTICLE = "article"
    BOOK = "book"
    VIDEO = "video"
    WEB = "web"
    OTHER = "other"