"""
Vercel Serverless Function handler for FastAPI
This file handles all /api/* routes and proxies them to the FastAPI application
"""
import sys
import traceback
import logging
from pathlib import Path

# Import Mangum at the start (external dependency, doesn't depend on backend code)
try:
    from mangum import Mangum
except ImportError:
    Mangum = None

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
try:
    logger.error("Attempting to import main...")
    from main import app
    logger.error("Successfully imported main.app")
except Exception as e:
    error_type = type(e).__name__
    error_message = str(e)
    error_traceback = traceback.format_exc()
    
    logger.error("=" * 80)
    logger.error("FATAL ERROR: Failed to import FastAPI app")
    logger.error("=" * 80)
    logger.error(f"Error Type: {error_type}")
    logger.error(f"Error Message: {error_message}")
    logger.error("Full Traceback:")
    logger.error(error_traceback)
    logger.error("=" * 80)
    
    print("=" * 80, file=sys.stderr)
    print(f"FATAL ERROR: Failed to import FastAPI app", file=sys.stderr)
    print(f"Error Type: {error_type}", file=sys.stderr)
    print(f"Error Message: {error_message}", file=sys.stderr)
    print("Full Traceback:", file=sys.stderr)
    print(error_traceback, file=sys.stderr)
    print("=" * 80, file=sys.stderr)
    
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

