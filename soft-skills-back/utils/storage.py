"""Supabase client for file storage operations."""
import logging
from pathlib import Path
from typing import Optional

from supabase import Client, create_client
from supabase.lib.client_options import ClientOptions

from utils.config import get_settings

logger = logging.getLogger(__name__)

settings = get_settings()


def _normalize_path(path: str) -> str:
    """Normalize file path for Supabase storage."""
    normalized = str(Path(path)).replace("\\", "/")
    return normalized.lstrip("/")


class SupabaseStorage:
    def __init__(
        self,
        supabase_url: Optional[str] = None,
        supabase_key: Optional[str] = None,
    ):
        self.supabase_url = supabase_url or settings.SUPABASE_URL
        self.supabase_key = supabase_key or settings.SUPABASE_SERVICE_ROLE_KEY

        if not self.supabase_url or not self.supabase_key:
            raise ValueError("Supabase URL and service role key must be configured")

        self.client: Client = create_client(
            self.supabase_url,
            self.supabase_key,
            options=ClientOptions(storage={"driver": "http"}),
        )

    def exists(self, bucket_name: str, file_path: str) -> bool:
        """
        Check if a file exists in the storage bucket with pagination support.
        """
        try:
            normalized_path = _normalize_path(file_path)
            directory = str(Path(normalized_path).parent)
            filename = Path(normalized_path).name

            files = self.client.storage.from_(bucket_name).list(
                path=directory,
                search=filename,
                limit=None,
            )

            file_exists = any(item.get("name") == filename for item in files)

            return file_exists

        except Exception as e:
            logger.error(f"Error checking if file exists: {str(e)}")
            return False

    def upload(
        self,
        bucket_name: str,
        file_path: str,
        data: bytes,
        content_type: Optional[str] = None,
        upsert: bool = True,
    ) -> str:
        """
        Upload bytes to Supabase storage.
        """
        if not data:
            raise ValueError("Cannot upload empty data")

        if not content_type:
            content_type = self._infer_content_type(file_path)

        try:
            normalized_path = _normalize_path(file_path)

            self.client.storage.from_(bucket_name).upload(
                path=normalized_path,
                file=data,
                file_options={
                    "content_type": content_type,
                    "upsert": "true" if upsert else "false",
                },
            )

            public_url = self.get_public_url(bucket_name, normalized_path)

            return public_url

        except Exception as e:
            raise Exception(f"Failed to upload file: {str(e)}")

    def get_public_url(self, bucket_name: str, file_path: str) -> str:
        """
        Get the public URL for a file in the storage bucket.
        """
        normalized_path = _normalize_path(file_path)

        public_url = self.client.storage.from_(bucket_name).get_public_url(
            normalized_path
        )

        if settings.PUBLIC_BASE_URL:
            public_url = f"{settings.PUBLIC_BASE_URL.rstrip('/')}/{bucket_name}/{normalized_path}"

        return public_url

    def get_signed_url(
        self, bucket_name: str, file_path: str, expires_in: int = 3600
    ) -> str:
        """
        Get a signed URL for temporary access to a file.
        """
        try:
            normalized_path = _normalize_path(file_path)

            response = self.client.storage.from_(bucket_name).create_signed_url(
                normalized_path, expires_in
            )

            signed_url = response.get("signedURL", "")

            return signed_url

        except Exception as e:
            raise Exception(f"Failed to generate signed URL: {str(e)}")

    def delete(self, bucket_name: str, file_path: str) -> bool:
        """
        Delete a file from the storage bucket.
        """
        try:
            normalized_path = _normalize_path(file_path)

            self.client.storage.from_(bucket_name).remove([normalized_path])

            logger.info(f"File deleted successfully: {normalized_path}")
            return True

        except Exception as e:
            logger.error(f"Error deleting file: {str(e)}")
            return False

    def _infer_content_type(self, file_path: str) -> str:
        """
        Infer MIME type from file extension.
        """
        extension = Path(file_path).suffix.lower()

        content_types = {
            ".mp3": "audio/mpeg",
            ".wav": "audio/wav",
            ".ogg": "audio/ogg",
            ".m4a": "audio/mp4",
            ".mp4": "video/mp4",
            ".webm": "video/webm",
            ".jpg": "image/jpeg",
            ".jpeg": "image/jpeg",
            ".png": "image/png",
            ".gif": "image/gif",
            ".webp": "image/webp",
            ".pdf": "application/pdf",
            ".json": "application/json",
            ".txt": "text/plain",
        }

        return content_types.get(extension, "application/octet-stream")


def get_storage_client() -> SupabaseStorage:
    """Get a configured Supabase storage client instance."""
    return SupabaseStorage()
