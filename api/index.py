"""
Vercel Serverless Function handler for FastAPI
This file handles all /api/* routes and proxies them to the FastAPI application
"""
import sys
import traceback
import os
from pathlib import Path

# Write to stderr immediately (Vercel captures this)
def log_error(msg):
    """Log to stderr immediately - Vercel captures this"""
    print(f"[ERROR] {msg}", file=sys.stderr, flush=True)

def log_info(msg):
    """Log to stderr - Vercel captures this"""
    print(f"[INFO] {msg}", file=sys.stderr, flush=True)

# Log startup immediately
log_error("=" * 80)
log_error("API HANDLER STARTING")
log_error("=" * 80)
log_error(f"Python version: {sys.version}")
log_error(f"Python path: {sys.path[:3]}")

# Check environment variables
log_error("Checking environment variables...")
env_vars = ['SECRET_KEY', 'DB_URI', 'DB_HOST', 'ACCESS_TOKEN_EXPIRE_MINUTES']
for var in env_vars:
    value = os.getenv(var)
    if value:
        log_error(f"  {var}: {'*' * min(len(value), 10)} (set)")
    else:
        log_error(f"  {var}: NOT SET")

# Import Mangum at the start (external dependency, doesn't depend on backend code)
log_error("Importing Mangum...")
try:
    from mangum import Mangum
    log_error("Mangum imported successfully")
except ImportError as e:
    log_error(f"Mangum import failed: {e}")
    Mangum = None

import logging
logging.basicConfig(
    level=logging.ERROR,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    stream=sys.stderr
)
logger = logging.getLogger(__name__)

# Add the backend directory to Python path
backend_path = Path(__file__).parent.parent / "soft-skills-back"
sys.path.insert(0, str(backend_path))

logger.error(f"Starting import from: {backend_path}")
logger.error(f"Python path: {sys.path[:3]}")
if Mangum is not None:
    logger.error("Mangum imported successfully")
else:
    logger.error("Mangum not available")

# Import FastAPI app
log_error("=" * 80)
log_error("ATTEMPTING TO IMPORT MAIN APP")
log_error("=" * 80)

try:
    log_error("Adding backend to Python path...")
    backend_path = Path(__file__).parent.parent / "soft-skills-back"
    sys.path.insert(0, str(backend_path))
    log_error(f"Backend path: {backend_path}")
    log_error(f"Path exists: {backend_path.exists()}")
    
    log_error("Importing main module...")
    from main import app
    log_error("SUCCESS: main.app imported successfully")
    logger.error("Successfully imported main.app")
except Exception as e:
    error_type = type(e).__name__
    error_message = str(e)
    error_traceback = traceback.format_exc()
    
    # Log to stderr with print (most reliable)
    log_error("=" * 80)
    log_error("FATAL ERROR: Failed to import FastAPI app")
    log_error("=" * 80)
    log_error(f"Error Type: {error_type}")
    log_error(f"Error Message: {error_message}")
    log_error("Full Traceback:")
    for line in error_traceback.split('\n'):
        log_error(line)
    log_error("=" * 80)
    
    # Also use logger
    logger.error("=" * 80)
    logger.error("FATAL ERROR: Failed to import FastAPI app")
    logger.error("=" * 80)
    logger.error(f"Error Type: {error_type}")
    logger.error(f"Error Message: {error_message}")
    logger.error("Full Traceback:")
    logger.error(error_traceback)
    logger.error("=" * 80)
    
    from fastapi import FastAPI, Request
    from fastapi.responses import JSONResponse
    
    error_app = FastAPI(title="Error App")
    
    @error_app.get("/")
    @error_app.post("/")
    @error_app.api_route("/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH"])
    async def error_handler(request: Request, path: str = ""):
        return JSONResponse(
            status_code=500,
            content={
                "error": "Server Configuration Error",
                "message": f"Failed to initialize application: {error_type}: {error_message}",
                "detail": "Check Vercel function logs for full traceback",
                "path": str(request.url.path)
            }
        )
    
    app = error_app
    logger.error("Created error handler app")

# Create handler with Mangum if available
if Mangum is not None:
    logger.error("Creating Mangum handler...")
    handler = Mangum(app, lifespan="off")
    logger.error("Successfully created Mangum handler")
else:
    logger.error("Using app directly (Mangum not available)")
    handler = app

logger.error("Handler setup complete")

