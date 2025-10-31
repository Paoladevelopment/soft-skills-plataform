"""Utilities for parsing dialogue text with speaker turns."""
import re
from typing import List
from enum import Enum


class SpeakerType(str, Enum):
    """Speaker types for dialogue parsing."""
    SPEAKER_1 = "Speaker 1"
    SPEAKER_2 = "Speaker 2"
    UNKNOWN = "Unknown"


class SpeakerTurn:
    """Represents a single speaker turn in a dialogue."""
    def __init__(self, speaker: SpeakerType, text: str):
        self.speaker = speaker
        self.text = text.strip()
    
    def __repr__(self):
        return f"SpeakerTurn(speaker={self.speaker}, text={self.text[:50]}...)"


_PATTERN = re.compile(
    r'(?im)^\s*speaker\s+(?P<num>1|2)\s*:\s*(?P<text>.*?)(?=^\s*speaker\s+(?:1|2)\s*:|\Z)'
)


def parse_speaker_turns(audio_text: str) -> List[SpeakerTurn]:
    """
    Parse dialogue text with "Speaker 1" and "Speaker 2" markers into speaker turns.
    """
    turns: List[SpeakerTurn] = []
    for m in _PATTERN.finditer(audio_text):
        num = m.group('num')
        text = m.group('text')

        speaker = SpeakerType.SPEAKER_1 if num == '1' else SpeakerType.SPEAKER_2
        turns.append(SpeakerTurn(speaker, text))
        
    return turns


def is_dialogue(audio_text: str) -> bool:
    """
    Check if the audio text contains dialogue markers (Speaker 1 / Speaker 2).
    """
    return bool(re.search(r'(?im)^\s*speaker\s+(?:1|2)\s*:', audio_text))


def get_default_voice_for_speaker(speaker: SpeakerType, settings) -> str | None:
    """
    Get the default voice ID for a speaker type from settings.
    
    Uses getattr to safely access settings attributes, returning None if not configured.
    """
    if speaker == SpeakerType.SPEAKER_1:
        return getattr(settings, "VOICE_SPK1_FEMALE", None)
    if speaker == SpeakerType.SPEAKER_2:
        return getattr(settings, "VOICE_SPK2_MALE", None)
    return getattr(settings, "VOICE_DEFAULT_SINGLE", None)
