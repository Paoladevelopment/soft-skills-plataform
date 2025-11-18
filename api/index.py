"""
Vercel Serverless Function handler for FastAPI
This file handles all /api/* routes and proxies them to the FastAPI application
"""
import sys
from pathlib import Path

# Add the backend directory to Python path
backend_path = Path(__file__).parent.parent / "soft-skills-back"
sys.path.insert(0, str(backend_path))

# Import FastAPI app
from main import app

# Use Mangum to adapt FastAPI (ASGI) to Vercel's serverless function format
try:
    from mangum import Mangum
    handler = Mangum(app, lifespan="off")
except ImportError:
    # Fallback: if mangum is not available, export app directly
    # Vercel Python runtime should handle ASGI apps
    handler = app

