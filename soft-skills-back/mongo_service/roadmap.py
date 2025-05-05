from typing import Dict, List
from bson import ObjectId
from datetime import datetime, timezone

from enums.roadmap import Visibility
from utils.mongodb import MongoDB
from utils.logger import logger_config
from utils.errors import APIException, Missing, handle_db_error
from nosql_models.roadmap import Roadmap
from nosql_schema.roadmap import to_roadmap_model, to_roadmap_summary_model, PaginatedRoadmapsResponse

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

    def get_user_roadmaps(self, user_id: str, offset: int, limit: int) -> PaginatedRoadmapsResponse:
        try:
            filter_query = { "user_id": user_id }

            total = self.mongodb.count_documents(self.collection_name, filter_query)

            documents = self.mongodb.find_many(
                self.collection_name, 
                filter_query,
                limit=limit,
                skip=offset,
                sort=[("created_at", -1)],
            )

            summaries = [to_roadmap_summary_model(doc) for doc in documents]

            return PaginatedRoadmapsResponse(data=summaries, total=total)
        
        except Exception as err:
            handle_db_error(err, "get_user_roadmaps")
      
    def get_public_roadmaps(self, offset: int, limit: int) -> PaginatedRoadmapsResponse:
        try:
            filter_query = { "visibility": "public" }

            total = self.mongodb.count_documents(self.collection_name, filter_query)

            documents = self.mongodb.find_many(
                self.collection_name,
                filter_query,
                limit=limit,
                skip=offset,
                sort=[("created_at", -1)],
            )

            summaries = [to_roadmap_summary_model(doc) for doc in documents]

            return PaginatedRoadmapsResponse(data=summaries, total=total)

        except Exception as err:
            handle_db_error(err, "get_public_roadmaps")

    def add_roadmap(self, roadmap_data: Dict, user_id: str) -> Dict:
        try:
            current_time = datetime.now(timezone.utc).isoformat()
            roadmap_data.update({
                "user_id": user_id,
                "visibility": Visibility.private,
                "created_at": current_time,
                "updated_at": current_time,
                "objectives": [],
            })

            result = self.mongodb.insert_one(self.collection_name, roadmap_data)
            roadmap_data["roadmap_id"] = str(result.inserted_id)
            return roadmap_data
        
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
