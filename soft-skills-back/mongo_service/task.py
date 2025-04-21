from typing import Dict
from uuid import UUID

from utils.mongodb import MongoDB
from utils.logger import logger_config

logger = logger_config(__name__)


class TaskMongoService:
    def __init__(self):
        self.mongodb = MongoDB()
        self.collection_name = "learning_goals"

    def add_task(self, learning_goal_id: UUID, objective_id: UUID, task_data: Dict):
        try:
            success = self.mongodb.update_one(
                self.collection_name,
                {
                    "_id": str(learning_goal_id),
                    "objectives": {
                        "$elemMatch": {
                            "objective_id": str(objective_id),
                            "tasks.task_id": {"$ne": task_data["task_id"]}
                        }
                    }
                },
                {
                    "$push": {
                        "objectives.$.tasks": task_data
                    }
                }
            )

            if not success:
                task_id = task_data['task_id']
                logger.info(f"Task {task_id} already exists in objective {objective_id}, skipping push.")

        except Exception as err:
            raise err

    def update_task(self, learning_goal_id: UUID, objective_id: UUID, task_id: UUID, update_data: Dict):
        try:
            success = self.mongodb.update_one(
                self.collection_name,
                {
                    "_id": str(learning_goal_id),
                    "objectives.objective_id": str(objective_id),
                    "objectives.tasks.task_id": str(task_id)
                },
                {
                    "$set": {
                        f"objectives.$[obj].tasks.$[task].{key}": value for key, value in update_data.items()
                    }
                },
                array_filters=[
                    {
                        "obj.objective_id": str(objective_id)
                    },
                    {
                        "task.task_id": str(task_id)
                    }
                ]
            )

            if not success:
                logger.warning(f"Task {task_id} not modified in MongoDB (already up to date or not found).")

        except Exception as err:
            raise err

    def delete_task(self, learning_goal_id: UUID, objective_id: UUID, task_id: UUID):
        try:
            success = self.mongodb.update_one(
                self.collection_name,
                {
                    "_id": str(learning_goal_id),
                    "objectives.objective_id": str(objective_id)
                },
                {
                    "$pull": {
                        "objectives.$.tasks": {
                            "task_id": str(task_id)
                        }
                    }
                }
            )

            if not success:
                logger.warning(f"Task {task_id} not found in MongoDB during deletion.")

        except Exception as err:
            raise err