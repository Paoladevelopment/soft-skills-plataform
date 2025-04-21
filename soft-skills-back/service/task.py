from typing import List, Sequence
from datetime import datetime, timezone
from uuid import UUID

from enums.common import Status
from fastapi import Depends
from model.learning_goal import LearningGoal
from model.objective import Objective
from model.task import Task
from mongo_service.task import TaskMongoService
from schema.task import TaskCreate, TaskUpdate
from service.learning_goal import LearningGoalService
from service.objective import ObjectiveService
from service.query import QueryService
from sqlmodel import Session, select
from utils.db import get_session
from utils.errors import APIException, Forbidden, Missing, handle_db_error
from utils.mongo_serializers import build_task_document


class TaskService:
    def __init__(self):
        self.query_service = QueryService()
        self.objective_service = ObjectiveService()
        self.learning_goal_service = LearningGoalService()
        self.mongo_service = TaskMongoService()
    
    def verify_user_ownership(self, objective_id: UUID, user_id: UUID, session: Session):
        try: 
            statement = (
                select(LearningGoal.user_id)
                .join(Objective, Objective.learning_goal_id == LearningGoal.learning_goal_id)
                .where(Objective.objective_id == objective_id)
            )
            
            task_owner_id = session.exec(statement).first()

            if task_owner_id != user_id:
                raise Forbidden("You are not allowed to modify this task")
            
        except APIException as api_error:
            raise api_error
        
        except Exception as err:
            handle_db_error(err, "verify_user_ownership", error_type="query")
  
        
    def create_task(self, task: TaskCreate, session: Session) -> Task:
        try:
            task_dict = task.model_dump()

            new_task = Task(**task_dict)
            new_task.created_at = datetime.now(timezone.utc)
            new_task.updated_at = new_task.created_at

            objective = self.objective_service.get_objective(new_task.objective_id, session)

            mongo_data = build_task_document(new_task)
            self.mongo_service.add_task(objective.learning_goal_id, new_task.objective_id, mongo_data)
            
            session.add(new_task)
            session.commit()
  
            return new_task
        
        except Exception as err:
            session.rollback()
            handle_db_error(err, "create_task", error_type="commit")
        

    def get_tasks_by_objective(
            self,
            objective_id: str,
            offset: int,
            limit: int, 
            status: str = None,
            priority: str = None,
            order_by: List[str] = None,
            session: Session = Depends(get_session),
        ) -> tuple[Sequence[Task], int]:

        try:
            return self.query_service._get_paginated_entities(
                entity=Task,
                filter_field="objective_id",
                filter_value=objective_id,
                offset=offset,
                limit=limit,
                status=status,
                priority=priority,
                order_by=order_by,
                session=session,
                default_order_field="order_index"
            )
        
        except Exception as err:
            handle_db_error(err, "get_tasks_by_objective", error_type="query")

    def get_task(self, task_id: UUID, session: Session) -> Task:
        try:
            task = session.get(Task, task_id)

            if not task:
                raise Missing("Task not found")
            return task
        
        except APIException as api_error:
            raise api_error

        except Exception as err:
            handle_db_error(err, "get_task", error_type="query")

    def update_task(self, task_id: UUID, task: TaskUpdate, user_id: UUID, session: Session) -> Task:
        try:
            existing_task = self.get_task(task_id, session)
            self.verify_user_ownership(existing_task.objective_id, user_id, session)

            task_data = task.model_dump(exclude_unset=True)
            for key, value in task_data.items():
                setattr(existing_task, key, value)

            existing_task.updated_at = datetime.now(timezone.utc)

            objective = self.objective_service.get_objective(existing_task.objective_id, session)

            mongo_data = build_task_document(existing_task)
            self.mongo_service.update_task(
                objective.learning_goal_id,
                existing_task.objective_id,
                task_id,
                mongo_data
            )

            session.commit()

            return existing_task
        
        except APIException as api_error:
            raise api_error
        
        except Exception as err:
            session.rollback()
            handle_db_error(err, "update_task", error_type="commit")

    def update_task_status(self, task_id: UUID, new_status: Status, user_id: UUID, session: Session) -> Task:
        try:
            existing_task = self.get_task(task_id, session)
            self.verify_user_ownership(existing_task.objective_id, user_id, session)

            existing_task.status = new_status
            existing_task.updated_at = datetime.now(timezone.utc)

            objective = self.objective_service.get_objective(existing_task.objective_id, session)

            mongo_data = build_task_document(existing_task)
            self.mongo_service.update_task(
                objective.learning_goal_id,
                existing_task.objective_id,
                task_id,
                mongo_data
            )

            self.objective_service.update_status(existing_task.objective_id, session)
            
            session.commit()

            return existing_task

        except APIException as api_error:
            raise api_error
        
        except Exception as err:
            session.rollback()
            handle_db_error(err, "update_task_status", error_type="commit")

    def delete_task(self, task_id: UUID, user_id: UUID, session: Session):
        try:
            task = self.get_task(task_id, session)
            self.verify_user_ownership(task.objective_id, user_id, session)

            objective = self.objective_service.get_objective(task.objective_id, session)

            self.mongo_service.delete_task(objective.learning_goal_id, task.objective_id, task_id)
            
            session.delete(task)
            session.commit()

            return {"message": "Task deleted successfully", "task_id": task_id}
        
        except APIException as api_error:
            raise api_error
        
        except Exception as exc:
            session.rollback()
            handle_db_error(exc, "delete_task", error_type="commit")