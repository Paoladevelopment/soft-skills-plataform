from typing import Dict, Optional
from bson import ObjectId
from datetime import datetime, timezone
from uuid import UUID
import re

from enums.roadmap import Visibility
from utils.mongodb import MongoDB
from utils.logger import logger_config
from utils.errors import APIException, Missing, handle_db_error
from nosql_models.roadmap import Roadmap
from nosql_schema.roadmap import to_roadmap_model, to_roadmap_summary_model, PaginatedRoadmapsResponse
from service.user import UserService
from sqlmodel import Session

logger = logger_config(__name__)


class RoadmapMongoService:
    def __init__(self):
        self.mongodb = MongoDB()
        self.mongodb.set_db("learning_roadmap") 
        self.collection_name = "roadmaps"
        self.user_service = UserService()

    def get_roadmap_by_id(self, roadmap_id: str) -> Roadmap:
        try:
            roadmap = self.mongodb.find_one(
                self.collection_name, 
                {
                    "_id": ObjectId(roadmap_id)
                }
            )

            if not roadmap:
                raise Missing("Plan de aprendizaje no encontrado")
            
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
      
    def _apply_steps_filtering(self, documents: list, steps_min: Optional[int], steps_max: Optional[int]) -> list:
        """Apply steps filtering to documents after converting to summary models"""
        filtered_summaries = []
        for doc in documents:
            summary = to_roadmap_summary_model(doc)
            
            if steps_min is not None and summary.steps_count < steps_min:
                continue
            if steps_max is not None and summary.steps_count > steps_max:
                continue
                
            filtered_summaries.append(summary)
        
        return filtered_summaries

    def get_public_roadmaps(
        self, 
        offset: int, 
        limit: int,
        title: Optional[str] = None,
        description: Optional[str] = None,
        created_at_from: Optional[datetime] = None,
        created_at_to: Optional[datetime] = None,
        steps_min: Optional[int] = None,
        steps_max: Optional[int] = None,
        username: Optional[str] = None
    ) -> PaginatedRoadmapsResponse:
        try:
            filter_query = {"visibility": "public"}
            
            if title:
                filter_query["title"] = {"$regex": re.escape(title), "$options": "i"}
            
            if description:
                filter_query["description"] = {"$regex": re.escape(description), "$options": "i"}
            
            if created_at_from or created_at_to:
                date_filter = {}
                if created_at_from:
                    date_filter["$gte"] = created_at_from.isoformat()
                if created_at_to:
                    date_filter["$lte"] = created_at_to.isoformat()
                filter_query["created_at"] = date_filter
            
            if username:
                filter_query["username"] = {"$regex": re.escape(username), "$options": "i"}

            total = self.mongodb.count_documents(self.collection_name, filter_query)

            documents = self.mongodb.find_many(
                self.collection_name,
                filter_query,
                limit=limit,
                skip=offset,
                sort=[("created_at", -1)],
            )

            summaries = []
            for doc in documents:
                summary = to_roadmap_summary_model(doc)
                
                if steps_min is not None and summary.steps_count < steps_min:
                    continue
                if steps_max is not None and summary.steps_count > steps_max:
                    continue
                    
                summaries.append(summary)

            if steps_min is not None or steps_max is not None:
                filtered_documents = self.mongodb.find_many(
                    self.collection_name,
                    filter_query,
                    sort=[("created_at", -1)],
                )
                
                filtered_summaries = self._apply_steps_filtering(filtered_documents, steps_min, steps_max)
                total = len(filtered_summaries)
                
                summaries = filtered_summaries[offset:offset + limit]

            return PaginatedRoadmapsResponse(data=summaries, total=total)

        except Exception as err:
            handle_db_error(err, "get_public_roadmaps")

    def add_roadmap(self, roadmap_data: Dict, user_id: str, session: Session) -> Dict:
        try:
            user = self.user_service.get_user(UUID(user_id), session)
            username = user.username
            
            current_time = datetime.now(timezone.utc).isoformat()
            roadmap_data.update({
                "user_id": user_id,
                "username": username,
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
                raise Missing(f"Plan de aprendizaje {roadmap_id} no encontrado")
              
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
