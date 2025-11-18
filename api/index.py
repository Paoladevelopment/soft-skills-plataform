"""
Vercel Serverless Function handler for FastAPI
This file handles all /api/* routes and proxies them to the FastAPI application
"""
import sys
import traceback
from pathlib import Path

# Add the backend directory to Python path
backend_path = Path(__file__).parent.parent / "soft-skills-back"
sys.path.insert(0, str(backend_path))

# Import FastAPI app with error handling
try:
    from main import app
except Exception as e:
    # Log the full error for debugging
    error_msg = f"Error importing FastAPI app: {str(e)}\n{traceback.format_exc()}"
    print(error_msg, file=sys.stderr)
    
    # Create a minimal error handler
    from fastapi import FastAPI
    from fastapi.responses import JSONResponse
    
    error_app = FastAPI()
    
    @error_app.exception_handler(Exception)
    async def global_exception_handler(request, exc):
        return JSONResponse(
            status_code=500,
            content={
                "error": "Server Configuration Error",
                "message": f"Failed to initialize application: {str(e)}",
                "detail": "Check server logs for more information"
            }
        )
    
    app = error_app

# Use Mangum to adapt FastAPI (ASGI) to Vercel's serverless function format
try:
    from mangum import Mangum
    handler = Mangum(app, lifespan="off")
except ImportError:
    # Fallback: if mangum is not available, export app directly
    # Vercel Python runtime should handle ASGI apps
    handler = app

