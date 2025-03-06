from fastapi import APIRouter
from router import user, auth, module, learning_goal

api = APIRouter(
  prefix="/api/v1"
)

api.include_router(
  auth.router,
  prefix="",
  tags=["auth"]
)

api.include_router(
  user.router,
  prefix="/user",
  tags=["users"]
)

api.include_router(
  module.router,
  prefix="/module",
  tags=["Soft skills modules"]
)

api.include_router(
  learning_goal.router,
  prefix="/learning-goals",
  tags=["User learning goals"]
)
