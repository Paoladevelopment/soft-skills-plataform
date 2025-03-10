import logging
import os
from contextlib import asynccontextmanager

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from router import api as api_routes
from utils.config import settings
from utils.logger import logger_config

load_dotenv()

logging.basicConfig(
    level=logging.INFO,  
    format="%(asctime)s - %(levelname)s - %(name)s - %(message)s",  
)

logger = logger_config(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):

    logger.info("startup: triggered")

    yield

    logger.info("shutdown: triggered")


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description=settings.DESCRIPTION,
    lifespan=lifespan,
)

origins = [
    "*",  # Permite solicitudes CORS desde este origen
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_routes)

if __name__ == "__main__":
    import uvicorn
    puerto : int = int(os.getenv('BACK_PORT'))
    uvicorn.run("main:app", host="0.0.0.0", port=puerto, reload=True)
