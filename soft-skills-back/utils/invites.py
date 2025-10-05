# Utilities for generating and hashing room-invite tokens.
import os, hmac, hashlib, base64, secrets

# Single env-based secret for invite hashing.
INVITE_TOKEN_SECRET = os.getenv("INVITE_TOKEN_SECRET", "dev-invite-default-secret").encode()

def generate_invite_token(nbytes: int = 32) -> str:
    """
        Generate a cryptographically strong, URL-safe token.

        Args:
            nbytes: Number of random bytes of entropy (default 32 ~= 256 bits).

        Returns:
            A Base64 URL-safe string (uses '-' and '_' instead of '+' and '/'),
            suitable for use in a query parameter without extra escaping.

        Notes:
            - With nbytes=32, you get ~256 bits of entropy. This is extremely hard to guess.
    """
    return secrets.token_urlsafe(nbytes)


def hash_invite_token(token: str) -> str:
    """
        Compute a deterministic, keyed hash (HMAC-SHA256) of the invite token.

        Why HMAC?
            - Deterministic: same token + same secret => same hash.
            - Keyed: without the secret, an attacker cannot reconstruct valid tokens from hashes.

        Args:
            token: The clear invite token as provided to the client.

        Returns:
            A Base64 URL-safe, padding-stripped string representation of the HMAC digest.
    """
    if not token:
        raise ValueError("Token cannot be empty")
    
    if not INVITE_TOKEN_SECRET:
        raise ValueError("INVITE_TOKEN_SECRET is not set")
    
    digest = hmac.new(INVITE_TOKEN_SECRET, token.encode(), hashlib.sha256).digest()
    return base64.urlsafe_b64encode(digest).decode().rstrip("=")