from fastapi import APIRouter
from router import (
  auth, 
  learning_goal, 
  module, 
  objective, 
  task, 
  user, 
  roadmap, 
  game_session
)

api = APIRouter(
  prefix="/api/v1"
)

api.include_router(
  auth.router,
  prefix="/auth",
  tags=["auth"]
)

api.include_router(
  user.router,
  prefix="/users",
  tags=["users"]
)

api.include_router(
  module.router,
  prefix="/modules",
  tags=["Soft skills modules"]
)

api.include_router(
  learning_goal.router,
  prefix="/learning-goals",
  tags=["User learning goals"]
)

api.include_router(
  objective.router,
  prefix="/objectives",
  tags=["Learning goal objectives"]
)

api.include_router(
  task.router,
  prefix="/tasks",
  tags=["Tasks"]
)

api.include_router(
  roadmap.router,
  prefix="/roadmap",
  tags=["Roadmaps"]
)

api.include_router(
  game_session.router,
  prefix="/game-sessions",
  tags=["Listening game sessions"]
)