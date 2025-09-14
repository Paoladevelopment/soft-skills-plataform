"""
Utility functions for data serialization
"""
from datetime import datetime, timezone


def serialize_datetime_without_microseconds(v: datetime | None) -> str | None:
    """
    Serialize datetime to ISO format without microseconds and with UTC timezone.
    
    Args:
        v: datetime object or None
        
    Returns:
        ISO formatted string with 'Z' suffix for UTC, or None if input is None
        
    Example:
        >>> from datetime import datetime, timezone
        >>> dt = datetime(2023, 1, 1, 12, 30, 45, 123456, timezone.utc)
        >>> serialize_datetime_without_microseconds(dt)
        '2023-01-01T12:30:45Z'
    """
    if v is None:
        return None
    
    if v.tzinfo is None:
        v = v.replace(tzinfo=timezone.utc)
    
    return v.replace(microsecond=0).isoformat().replace("+00:00", "Z")
