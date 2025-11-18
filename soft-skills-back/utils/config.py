import logging
import os
from functools import lru_cache
from pathlib import Path

from dotenv import load_dotenv
from pydantic_settings import BaseSettings

#Load environment variables from a .env file, if available
load_dotenv()

#Define the directory and default SQLite database path
top_dir = Path(__file__).resolve().parents[0]
db_dir = top_dir / "db"
sqlite_db_name = "tesis.db"
sqlite_db_path = str(db_dir / sqlite_db_name)

# Only create db directory if not in serverless environment (Vercel)
# In serverless, filesystem is read-only except /tmp, and we should use PostgreSQL
try:
    db_dir.mkdir(parents=True, exist_ok=True)
except (OSError, PermissionError):
    # In serverless environments (like Vercel), filesystem is read-only
    # This is fine - we should use PostgreSQL in production anyway
    pass

class Settings(BaseSettings):
  PROJECT_NAME : str = "Soft skills backend"
  DESCRIPTION : str = "A FastAPI soft skills production-ready API"
  VERSION : str = "0.1"

  DB_URI: str | None = os.getenv('DB_URI') # Full connection string (takes priority)
  DB_HOST: str | None = os.getenv('DB_HOST')
  DB_NAME: str | None = os.getenv('DB_NAME')
  DB_PORT: str | None = os.getenv('DB_PORT')
  DB_USER: str | None = os.getenv('DB_USER')
  DB_PASS: str | None = os.getenv('DB_PASSWORD')

  SECRET_KEY: str = os.getenv('SECRET_KEY')
  TOKEN_EXPIRE: str = os.getenv('ACCESS_TOKEN_EXPIRE_MINUTES')

  SQLITE_PATH: str = sqlite_db_path
  
  ELEVENLABS_API_KEY: str | None = os.getenv('ELEVENLABS_API_KEY')
  VOICE_SPK1_FEMALE: str | None = os.getenv('VOICE_SPK1_FEMALE')
  VOICE_SPK2_MALE: str | None = os.getenv('VOICE_SPK2_MALE')
  VOICE_DEFAULT_SINGLE: str | None = os.getenv('VOICE_DEFAULT_SINGLE')
  
  SUPABASE_URL: str | None = os.getenv('SUPABASE_URL')
  SUPABASE_SERVICE_ROLE_KEY: str | None = os.getenv('SUPABASE_SERVICE_ROLE_KEY')
  SUPABASE_BUCKET: str = os.getenv('SUPABASE_BUCKET', 'challenges-audio')
  PUBLIC_BASE_URL: str | None = os.getenv('PUBLIC_BASE_URL')
  
  ELEVENLABS_DEFAULT_MODEL: str = os.getenv('ELEVENLABS_DEFAULT_MODEL', 'eleven_multilingual_v2')
  AUDIO_DEFAULT_FORMAT: str = os.getenv('AUDIO_DEFAULT_FORMAT', 'mp3')
  AUDIO_STORAGE_TYPE: str = os.getenv('AUDIO_STORAGE_TYPE', 'supabase')

  def __is_valid_db_uri(self) -> bool:
    if self.DB_URI:
      return self.DB_URI.startswith(("postgresql://", "mysql://", "postgresql+psycopg2://"))

  @property
  def DATABASE_URI(self) -> str:
    if self.__is_valid_db_uri():
      return self.DB_URI
    
    if all([self.DB_HOST, self.DB_NAME, self.DB_PORT, self.DB_USER, self.DB_PASS]):
      return (f"postgresql://{self.DB_USER}:{self.DB_PASS}@{self.DB_HOST}:"
              f"{self.DB_PORT}/{self.DB_NAME}")
    
    return f"sqlite:///{self.SQLITE_PATH}"
  
  class Config:
    case_sensitive: True

logger = logging.getLogger(__name__)

@lru_cache
def get_settings():
    logger.info("Loading application settings...")
    return Settings()

settings = get_settings()

class TestSettings(Settings):
    class Config:
        case_sensitive = True


test_settings = TestSettings()