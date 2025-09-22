from typing import Sequence
from datetime import datetime, timezone
from uuid import UUID

from enums.common import Status
from fastapi import Depends
from model.learning_goal import LearningGoal
from model.objective import Objective
from mongo_service.learning_goal import LearningGoalMongoService
from schema.learning_goal import LearningGoalCreate, LearningGoalUpdate, LearningGoalReadWithProgress
from sqlmodel import desc, Session, func, select
from sqlalchemy.orm import attributes
from sqlalchemy.sql import case
from utils.db import get_session
from utils.errors import APIException, Forbidden, Missing, handle_db_error
from utils.mongo_serializers import build_learning_goal_document
from mongo_service.roadmap import RoadmapMongoService


class LearningGoalService:
    def __init__(self):
        self.mongo_service = LearningGoalMongoService()
        self.roadmap_mongo_service = RoadmapMongoService()

    def verify_user_ownership(self, learning_goal: LearningGoal, user_id: UUID):
        if learning_goal.user_id != user_id:
                raise Forbidden("You are not allowed to perform this action")
        
    def create_learning_goal(self, user_id: UUID, learning_goal: LearningGoalCreate, session: Session) -> LearningGoal:
        try:
            learning_goal_dict = learning_goal.model_dump()

            new_learning_goal = LearningGoal(**learning_goal_dict)
            new_learning_goal.user_id = user_id
            new_learning_goal.created_at = datetime.now(timezone.utc)
            new_learning_goal.updated_at = new_learning_goal.created_at

            mongo_data = build_learning_goal_document(new_learning_goal)
            self.mongo_service.create_learning_goal(mongo_data)
            
            session.add(new_learning_goal)
            session.commit()

            return new_learning_goal
        
        except Exception as err:
            session.rollback()
            handle_db_error(err, "create_learning_goal", error_type="commit")

    def __attach_objective_progress(
        self,
        goal: LearningGoal,
        session: Session
    ) -> LearningGoalReadWithProgress:
        
        summary = self._objectives_by_status(goal.learning_goal_id, session)

        return LearningGoalReadWithProgress(
            **goal.model_dump(),
            total_objectives=summary["total"],
            completed_objectives=summary["completed"]
        )

    def get_all_user_learning_goals(
            self,
            user_id: UUID,
            offset: int,
            limit: int, 
            session: Session = Depends(get_session),
        ) -> tuple[Sequence[LearningGoalReadWithProgress], int]:

        try:
            total_count = session.scalar(
                select(func.count()).where(LearningGoal.user_id == user_id)
            )

            user_learning_goals = session.exec(
                select(LearningGoal)
                .where(LearningGoal.user_id == user_id)
                .order_by(desc(LearningGoal.created_at))
                .offset(offset)
                .limit(limit)
            ).all()

            learning_goals = []
            for goal in user_learning_goals:
                learning_goal = self.__attach_objective_progress(goal, session)
                learning_goals.append(learning_goal)

            return learning_goals, total_count
        
        except Exception as err:
            handle_db_error(err, "get_all_user_learning_goals", error_type="query")

    def get_learning_goal(self, learning_goal_id: UUID, session: Session) -> LearningGoal:
        try:
            learning_goal = session.get(LearningGoal, learning_goal_id)

            if not learning_goal:
                raise Missing("Learning goal not found")
            
            return learning_goal
        
        except APIException as api_error:
            raise api_error

        except Exception as err:
            handle_db_error(err, "get_learning_goal", error_type="query")
    
    def _objectives_by_status(self, learning_goal_id: UUID, session: Session):
        try:
            completed_case = case((Objective.status == Status.COMPLETED, 1), else_=0)
            active_case = case((Objective.status.in_([Status.IN_PROGRESS, Status.PAUSED, Status.COMPLETED]), 1), else_=0)

            result = session.exec(
                select(
                    func.count().label("total"),
                    func.sum(completed_case).label("completed"),
                    func.sum(active_case).label("active"),
                )
                .where(Objective.learning_goal_id == learning_goal_id)
            ).first()

            if result is None:
                return {
                    "total": 0,
                    "completed": 0,
                    "active": 0,
                }

            total, completed, active = (result[0] or 0), (result[1] or 0), (result[2] or 0)
            return {
                "total": total,
                "completed": completed,
                "active": active,
            }
        
        except Exception as err:
            handle_db_error(err, "_objectives_by_status", error_type="query")

    def update_learning_goal(self, learning_goal_id: UUID, learning_goal: LearningGoalUpdate, user_id: UUID, session: Session) -> LearningGoal:
        try:
            existing_learning_goal = self.get_learning_goal(learning_goal_id, session)
            self.verify_user_ownership(existing_learning_goal, user_id)

            learning_goal_data = learning_goal.model_dump(exclude_unset=True)
            for key, value in learning_goal_data.items():
                setattr(existing_learning_goal, key, value)

            existing_learning_goal.updated_at = datetime.now(timezone.utc)

            mongo_data = build_learning_goal_document(existing_learning_goal)
            self.mongo_service.update_learning_goal(learning_goal_id, mongo_data)

            session.commit()

            return existing_learning_goal
        
        except APIException as api_error:
            raise api_error
        
        except Exception as err:
            session.rollback()
            handle_db_error(err, "update_learning_goal", error_type="commit")

    def add_objective_to_order(self, learning_goal_id: UUID, objective_id: UUID, session: Session):
        """Add an objective to the end of the objectives_order array"""
        try:
            learning_goal = self.get_learning_goal(learning_goal_id, session)
            
            if learning_goal.objectives_order is None:
                learning_goal.objectives_order = []
            
            if objective_id in learning_goal.objectives_order:
                return 
                
            learning_goal.objectives_order.append(objective_id)
            learning_goal.updated_at = datetime.now(timezone.utc)
            
            attributes.flag_modified(learning_goal, 'objectives_order')
            
            session.commit()
            
            mongo_data = build_learning_goal_document(learning_goal)
            self.mongo_service.update_learning_goal(learning_goal_id, mongo_data)
                
        except APIException as api_error:
            raise api_error
        
        except Exception as err:
            handle_db_error(err, "add_objective_to_order", error_type="update")

    def remove_objective_from_order(self, learning_goal_id: UUID, objective_id: UUID, session: Session):
        """Remove an objective from the objectives_order array"""
        try:
            learning_goal = self.get_learning_goal(learning_goal_id, session)
            
            if not learning_goal.objectives_order:
                return
                
            if objective_id not in learning_goal.objectives_order:
                return 
                
            learning_goal.objectives_order.remove(objective_id)
            learning_goal.updated_at = datetime.now(timezone.utc)
            
            attributes.flag_modified(learning_goal, 'objectives_order')
            
            session.commit()
            
            mongo_data = build_learning_goal_document(learning_goal)
            self.mongo_service.update_learning_goal(learning_goal_id, mongo_data)
                    
        except APIException as api_error:
            raise api_error
        
        except Exception as err:
            handle_db_error(err, "remove_objective_from_order", error_type="update")

    def update_learning_goal_completion_after_objective_change(self, learning_goal_id: UUID, session: Session):
        """Update learning goal completed_at field after objective status changes"""
        try:
            learning_goal = self.get_learning_goal(learning_goal_id, session)
            
            objective_counts = self._objectives_by_status(learning_goal_id, session)
            total = objective_counts["total"]
            completed = objective_counts["completed"]
            active = objective_counts["active"]
            
            now = datetime.now(timezone.utc)
            
            all_completed = completed == total and total > 0
            should_set_completed = all_completed and learning_goal.completed_at is None
            should_clear_completed = not all_completed and learning_goal.completed_at is not None
            
            should_set_started = (active > 0 and learning_goal.started_at is None)
            
            if should_set_completed:
                learning_goal.completed_at = now
                learning_goal.updated_at = now
            elif should_clear_completed:
                learning_goal.completed_at = None
                learning_goal.updated_at = now
            
            if should_set_started:
                learning_goal.started_at = now
                learning_goal.updated_at = now
            
            if should_set_completed or should_clear_completed or should_set_started:
                mongo_data = build_learning_goal_document(learning_goal)
                self.mongo_service.update_learning_goal(learning_goal_id, mongo_data)
                
        except APIException as api_error:
            raise api_error
        
        except Exception as err:
            handle_db_error(err, "update_learning_goal_completion_after_objective_change", error_type="update")

    def delete_learning_goal(self, learning_goal_id: UUID, user_id: UUID, session: Session):
        try:
            learning_goal = self.get_learning_goal(learning_goal_id, session)
            self.verify_user_ownership(learning_goal, user_id)
            
            session.delete(learning_goal)
            self.mongo_service.delete_learning_goal(learning_goal_id)

            session.commit()

            return {"message": "Learning goal deleted successfully", "learning_goal_id": learning_goal_id}
        
        except APIException as api_error:
            raise api_error
        
        except Exception as err:
            session.rollback()
            handle_db_error(err, "delete_learning_goal", error_type="commit")

    def convert_to_roadmap(self, learning_goal_id: UUID, user_id: UUID, session: Session) -> dict:
        """Convert a learning goal to a roadmap format"""
        try:
            learning_goal = self.get_learning_goal(learning_goal_id, session)
            self.verify_user_ownership(learning_goal, user_id)
            
            learning_goal_mongo = self.mongo_service.get_learning_goal(learning_goal_id)
            
            roadmap_data = {
                "learning_goal_id": str(learning_goal_id),
                "title": learning_goal_mongo["title"],
                "description": learning_goal_mongo["description"],
                "user_id": str(user_id),
                "started_at": None,
                "completed_at": None,
                "objectives": []
            }
            
            objectives_order = learning_goal_mongo.get("objectives_order", [])
            mongo_objectives = learning_goal_mongo.get("objectives", [])
            
            objective_map = {obj["objective_id"]: obj for obj in mongo_objectives}
            
            all_objective_ids = []
            
            for objective_id in objectives_order:
                if objective_id in objective_map:
                    all_objective_ids.append(objective_id)
            
            for objective_id in objective_map.keys():
                if objective_id not in all_objective_ids:
                    all_objective_ids.append(objective_id)
            
            converted_objectives = []
            for index, objective_id in enumerate(all_objective_ids):
                mongo_obj = objective_map[objective_id]
                
                converted_tasks = self._convert_tasks_with_order(
                    mongo_obj.get("tasks", []), 
                    mongo_obj.get("tasks_order_by_status", {})
                )
                
                converted_objective = {
                    "objective_id": objective_id,
                    "learning_goal_id": str(learning_goal_id),
                    "title": mongo_obj["title"],
                    "description": mongo_obj.get("description", ""),
                    "order_index": index,
                    "tasks": converted_tasks
                }
                converted_objectives.append(converted_objective)
            
            roadmap_data["objectives"] = converted_objectives
            
            objectives = roadmap_data.pop("objectives")
            result = self.roadmap_mongo_service.add_roadmap(roadmap_data, str(user_id), session)
            
            roadmap_id = result["roadmap_id"]
            self.roadmap_mongo_service.update_roadmap(roadmap_id, {"objectives": objectives})
            
            return {
                "message": "Learning goal converted to roadmap successfully",
                "roadmap_id": result["roadmap_id"]
            }
            
        except APIException as api_error:
            raise api_error
        
        except Exception as err:
            handle_db_error(err, "convert_to_roadmap", error_type="conversion")

    def _convert_tasks_with_order(self, tasks: list, tasks_order_by_status: dict) -> list:
        """Convert tasks with proper order_index based on status priority (completed first)"""
        task_map = {task["task_id"]: task for task in tasks}
        
        status_priority = ["completed", "in_progress", "paused", "not_started"]
        
        converted_tasks = []
        order_index = 0
        
        for status in status_priority:
            task_ids = tasks_order_by_status.get(status, [])
            for task_id in task_ids:
                if task_id in task_map:
                    task = task_map[task_id]
                    converted_task = {
                        "task_id": task_id,
                        "title": task["title"],
                        "description": task.get("description", ""),
                        "order_index": order_index,
                        "type": task.get("type"),
                        "content_title": task.get("content_title"),
                        "resources": task.get("resources", []),
                        "comments": task.get("comments", [])
                    }
                    converted_tasks.append(converted_task)
                    order_index += 1
        
        return converted_tasks