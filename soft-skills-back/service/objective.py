from typing import Sequence
from datetime import datetime, timezone
from uuid import UUID

from enums.common import Status
from fastapi import Depends
from model.learning_goal import LearningGoal
from model.objective import Objective
from model.task import Task
from mongo_service.objective import ObjectiveMongoService
from schema.objective import ObjectiveCreate, ObjectiveUpdate
from service.query import QueryService
from sqlalchemy.sql import case
from sqlmodel import Session, func, select
from utils.db import get_session
from utils.errors import APIException, Forbidden, Missing, handle_db_error
from utils.mongo_serializers import build_objective_document


class ObjectiveService:
    def __init__(self):
        self.query_service = QueryService()
        self.mongo_service = ObjectiveMongoService()

    def verify_user_ownership(self, objective_id: UUID, user_id: UUID, session: Session):
        try:
            statement = (
                select(LearningGoal.user_id)
                .join(Objective, Objective.learning_goal_id == LearningGoal.learning_goal_id)
                .where(Objective.objective_id == objective_id)
            )
            
            objective_owner_id = session.exec(statement).first()

            if objective_owner_id != user_id:
                raise Forbidden("You are not allowed to modify this objective")
        
        except APIException as api_error:
            raise api_error
        
        except Exception as err:
            handle_db_error(err, "verify_user_ownership", error_type="query")
  
        
    def create_objective(self, objective: ObjectiveCreate, session: Session) -> Objective:
        try:
            objective_dict = objective.model_dump()

            new_objective = Objective(**objective_dict)
            new_objective.created_at = datetime.now(timezone.utc)
            new_objective.updated_at = new_objective.created_at

            mongo_data = build_objective_document(new_objective)
            self.mongo_service.add_objective(new_objective.learning_goal_id, mongo_data)
            
            session.add(new_objective)
            session.commit()

            return new_objective
        
        except Exception as err:
            session.rollback()
            handle_db_error(err, "create_objective", error_type="commit")
        

    def get_objectives_by_learning_goal(
            self,
            learning_goal_id: str,
            offset: int,
            limit: int, 
            status: str = None,
            priority: str = None,
            order_by: list[str] = None,
            session: Session = Depends(get_session),
        ) -> tuple[Sequence[Objective], int]:

        try:
            return self.query_service._get_paginated_entities(
                entity=Objective,
                filter_field="learning_goal_id",
                filter_value=learning_goal_id,
                offset=offset,
                limit=limit,
                status=status,
                priority=priority,
                order_by=order_by,
                default_order_field="order_index",
                session=session
            )
        
        except Exception as err:
            handle_db_error(err, "get_objectives_by_learning_goal", error_type="query")

    def get_objective(self, objective_id: UUID, session: Session) -> Objective:
        try:
            objective = session.get(Objective, objective_id)

            if not objective:
                raise Missing("Objective not found")
            return objective
        
        except APIException as api_error:
            raise api_error

        except Exception as err:
            handle_db_error(err, "get_objective", error_type="query")
    
    def _tasks_by_status(self, objective_id: UUID, session: Session):
        try:
            completed_case = case((Task.status == Status.COMPLETED, 1), else_=0)
            in_progress_case = case((Task.status == Status.IN_PROGRESS, 1), else_=0)
            paused_case = case((Task.status == Status.PAUSED, 1), else_=0)


            result = session.exec(
                select(
                    func.count().label("total"),
                    func.sum(completed_case).label("completed"),
                    func.sum(in_progress_case).label("in_progress"),
                    func.sum(paused_case).label("paused")
                )
                .where(Task.objective_id == objective_id)
            ).first()

            if not result:
                raise Missing(f"No tasks found for Objective ID {objective_id}")

            total, completed, in_progress, paused = (result[0] or 0), (result[1] or 0), (result[2] or 0), (result[3] or 0)
            return {
                "total": total,
                "completed": completed,
                "in_progress": in_progress,
                "paused": paused,
            }

        except APIException as api_error:
            raise api_error
        
        except Exception as err:
            handle_db_error(err, "_tasks_by_status", error_type="query")

    def update_objective(self, objective_id: UUID, objective: ObjectiveUpdate, user_id: UUID, session: Session) -> Objective:
        try:
            existing_objective = self.get_objective(objective_id, session)
            self.verify_user_ownership(objective_id, user_id, session)

            objective_data = objective.model_dump(exclude_unset=True)
            for key, value in objective_data.items():
                setattr(existing_objective, key, value)

            existing_objective.updated_at = datetime.now(timezone.utc)

            mongo_data = build_objective_document(existing_objective)
            self.mongo_service.update_objective(
                existing_objective.learning_goal_id,
                objective_id,
                mongo_data
            )

            session.commit()

            return existing_objective
        
        except APIException as api_error:
            raise api_error
        
        except Exception as err:
            session.rollback()
            handle_db_error(err, "update_objective", error_type="commit")

    def update_status(self, objective_id: UUID, session: Session):
        try:
            task_counts = self._tasks_by_status(objective_id, session)

            total = task_counts["total"]
            completed = task_counts["completed"]
            in_progress = task_counts["in_progress"]
            paused = task_counts["paused"]

            if completed == total:
                new_status = Status.COMPLETED
            elif in_progress > 0:
                new_status = Status.IN_PROGRESS
            elif paused == total:
                new_status = Status.PAUSED
            else:
                new_status = Status.NOT_STARTED
        
            objective = self.get_objective(objective_id, session)

            if objective.status != new_status:
                objective.status = new_status
                objective.updated_at = datetime.now(timezone.utc)

                mongo_data = build_objective_document(objective)
                self.mongo_service.update_objective(
                    objective.learning_goal_id,
                    objective_id,
                    mongo_data
                )

                session.commit()

        except APIException as api_error:
            raise api_error

        except Exception as err:
            session.rollback()
            handle_db_error(err, "update_status", error_type="commit")


    def delete_objective(self, objective_id: UUID, user_id: UUID, session: Session):
        try:
            objective = self.get_objective(UUID(objective_id), session)
            self.verify_user_ownership(UUID(objective_id), user_id, session)
            
            learning_goal_id = objective.learning_goal_id

            self.mongo_service.delete_objective(learning_goal_id, objective_id)
            
            session.delete(objective)
            session.commit()

            return {"message": "Objective deleted successfully", "objective_id": objective_id}
        
        except APIException as api_error:
            raise api_error
        
        except Exception as err:
            session.rollback()
            handle_db_error(err, "delete_objective", error_type="commit")