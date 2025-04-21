from typing import Dict
from uuid import UUID

from pymongo.errors import DuplicateKeyError

from utils.errors import APIException, Missing
from utils.mongodb import MongoDB
from utils.logger import logger_config

logger = logger_config(__name__)


class LearningGoalMongoService:
    def __init__(self):
        self.mongodb = MongoDB()
        self.collection_name = "learning_goals"

    def create_learning_goal(self, learning_goal_data: Dict):
        try:
            learning_goal_data["objectives"] = []
            learning_goal_data["_id"] = str(learning_goal_data["learning_goal_id"])

            self.mongodb.insert_one(self.collection_name, learning_goal_data)
        
        except DuplicateKeyError:
            learning_goal_id = learning_goal_data['_id']
            logger.warning(f"Learning goal with ID {learning_goal_id} already exists in MongoDB. Skipping insert.")

        except Exception as err:
            raise err

    def get_learning_goal(self, learning_goal_id: UUID) -> Dict:
        try:
            learning_goal = self.mongodb.find_one(
                self.collection_name,
                {
                    "_id": str(learning_goal_id)
                }
            )

            if not learning_goal:
                raise Missing("Learning goal not found")

            return learning_goal

        except APIException as api_error:
            raise api_error
        
        except Exception as err:
            raise err

    def update_learning_goal(self, learning_goal_id: UUID, update_data: Dict):
        try:
            success = self.mongodb.update_one(
                self.collection_name,
                {
                    "_id": str(learning_goal_id)
                },
                {
                    "$set": update_data
                }
            )

            if not success:
                logger.warning(f"Learning goal {learning_goal_id} not modified in MongoDB (already up to date or not found).")

        except Exception as err:
            raise err

    def delete_learning_goal(self, learning_goal_id: UUID):
        try:
            success = self.mongodb.delete_one(
                self.collection_name,
                {
                    "_id": str(learning_goal_id)
                }
            )

            if not success:
                logger.warning(f"Learning goal {learning_goal_id} not found in MongoDB during deletion.")

        except Exception as err:
            raise err