from typing import Dict, List
from bson import ObjectId
from datetime import datetime, timezone

from utils.mongodb import MongoDB
from utils.logger import logger_config
from utils.errors import APIException, Missing, handle_db_error
from nosql_models.roadmap import Roadmap
from nosql_schema.roadmap import to_roadmap_model

logger = logger_config(__name__)


class RoadmapMongoService:
    def __init__(self):
        self.mongodb = MongoDB()
        self.mongodb.set_db("learning_roadmap") 
        self.collection_name = "roadmaps"

    def get_roadmap_by_id(self, roadmap_id: str) -> Roadmap:
        try:
            roadmap = self.mongodb.find_one(
                self.collection_name, 
                {
                    "_id": ObjectId(roadmap_id)
                }
            )

            if not roadmap:
                raise Missing("Roadmap not found")
            
            return to_roadmap_model(roadmap)
        
        except APIException as api_error:
            raise api_error
        
        except Exception as err:
            handle_db_error(err, "get_roadmap_by_id")

    def get_user_roadmaps(self, user_id: str) -> List[Roadmap]:
        try:
            documents = self.mongodb.find_many(
                self.collection_name, 
                {
                    "user_id": user_id
                }
            )

            return [to_roadmap_model(doc) for doc in documents]
        
        except Exception as err:
            handle_db_error(err, "get_user_roadmaps")
      
    def get_public_roadmaps(self) -> List[Roadmap]:
        try:
            documents = self.mongodb.find_many(
                self.collection_name,
                {
                    "visibility": "public"
                }
            )

            return [to_roadmap_model(doc) for doc in documents]

        except Exception as err:
            handle_db_error(err, "get_public_roadmaps")

    def add_roadmap(self, roadmap_data: Dict) -> str:
        try:
            roadmap_data["created_at"] = datetime.now(timezone.utc).isoformat()

            result = self.mongodb.insert_one(self.collection_name, roadmap_data)
            return str(result.inserted_id)
        
        except Exception as err:
            handle_db_error(err, "add_roadmap")

    def delete_roadmap(self, roadmap_id: str) -> bool:
        try:
            success = self.mongodb.delete_one(
                self.collection_name, 
                {
                    "_id": ObjectId(roadmap_id)
                }
            )

            if not success:
                raise Missing(f"Roadmap {roadmap_id} not found")
              
            return success
        
        except APIException as api_error:
            raise api_error
        
        except Exception as err:
            handle_db_error(err, "delete_roadmap")

    def update_roadmap(self, roadmap_id: str, update_data: Dict) -> bool:
        try:
            logger.info(f"Update data to apply: {update_data}")
            update_data["updated_at"] = datetime.now(timezone.utc).isoformat()

            success = self.mongodb.update_one(
                self.collection_name,
                {
                    "_id": ObjectId(roadmap_id)
                },
                {
                    "$set": update_data
                }
            )

            if not success:
                logger.warning(f"Roadmap {roadmap_id} was not modified (not found or same data).")
            return success
        
        except Exception as err:
            handle_db_error(err, "update_roadmap")
