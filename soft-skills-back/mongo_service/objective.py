from typing import Dict
from uuid import UUID

from utils.mongodb import MongoDB
from utils.logger import logger_config

logger = logger_config(__name__)


class ObjectiveMongoService:
    def __init__(self):
        self.mongodb = MongoDB()
        self.collection_name = "learning_goals"

    def add_objective(self, learning_goal_id: UUID, objective_data: Dict):
        try:
            objective_data["tasks"] = []

            success = self.mongodb.update_one(
                self.collection_name,
                {
                    "learning_goal_id": str(learning_goal_id),
                    "objectives.objective_id": {
                        "$ne": objective_data["objective_id"]
                    }
                },
                {
                    "$push": {
                        "objectives": objective_data
                    }
                }
            )

            if not success:
                objective_id = objective_data['objective_id']
                logger.info(f"Objective {objective_id} already exists in learning goal {learning_goal_id}, skipping push.")

        except Exception as err:
            raise err

    def update_objective(self, learning_goal_id: UUID, objective_id: UUID, update_data: Dict):
        try:
            success = self.mongodb.update_one(
                self.collection_name,
                {
                    "learning_goal_id": str(learning_goal_id),
                    "objectives.objective_id": str(objective_id)
                },
                {
                    "$set": {
                        f"objectives.$.{key}": value for key, value in update_data.items()
                    }
                }
            )

            if not success:
                logger.warning(f"Objective {objective_id} not modified in MongoDB (already up to date or not found).")

        except Exception as err:
            raise err

    def delete_objective(self, learning_goal_id: UUID, objective_id: UUID):
        try:
            success = self.mongodb.update_one(
                self.collection_name,
                {
                    "learning_goal_id": str(learning_goal_id)
                },
                {
                    "$pull": {
                        "objectives": {
                            "objective_id": str(objective_id)
                        }
                    }
                }
            )

            if not success:
                logger.warning(f"Objective {objective_id} not found in MongoDB during deletion.")

        except Exception as err:
            raise err