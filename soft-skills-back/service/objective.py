from typing import Sequence
from datetime import datetime, timezone
from uuid import UUID

from enums.common import Status
from fastapi import Depends
from model.learning_goal import LearningGoal
from model.objective import Objective
from model.task import Task
from mongo_service.objective import ObjectiveMongoService
from schema.objective import ObjectiveCreate, ObjectiveUpdate, ObjectiveReadWithProgress
from service.learning_goal import LearningGoalService
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
        self.learning_goal_service = LearningGoalService()

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

            session.add(new_objective)
            session.flush() 

            mongo_data = build_objective_document(new_objective)
            self.mongo_service.add_objective(new_objective.learning_goal_id, mongo_data)
            
            self.learning_goal_service.add_objective_to_order(
                new_objective.learning_goal_id, 
                new_objective.objective_id, 
                session
            )
            
            session.commit()

            return new_objective
        
        except Exception as err:
            session.rollback()
            handle_db_error(err, "create_objective", error_type="commit")
        
    def __attach_task_progress(
            self,
            objective: Objective,
            session: Session
    ) -> ObjectiveReadWithProgress:
        task_summary = self._tasks_by_status(objective.objective_id, session)

        return ObjectiveReadWithProgress(
            **objective.model_dump(),
            total_tasks=task_summary["total"],
            completed_tasks=task_summary["completed"]
        )
        
    def get_objectives_by_learning_goal(
            self,
            learning_goal_id: str,
            offset: int,
            limit: int, 
            status: str = None,
            priority: list[str] = None,
            search: str = None,
            order_by: list[str] = None,
            session: Session = Depends(get_session),
        ) -> tuple[Sequence[ObjectiveReadWithProgress], int]:

        try:
            objectives, total_count = self.query_service._get_paginated_entities(
                entity=Objective,
                filter_field="learning_goal_id",
                filter_value=learning_goal_id,
                offset=offset,
                limit=limit,
                status=status,
                priority=priority,
                search=search,
                order_by=order_by,
                default_order_field="created_at",
                session=session
            )

            objectives_with_progress = []
            for objective in objectives:
                objective_with_progress = self.__attach_task_progress(objective, session)
                objectives_with_progress.append(objective_with_progress)
            
            return objectives_with_progress, total_count
        
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
            objective = self.get_objective(objective_id, session)
            self.verify_user_ownership(objective_id, user_id, session)
            
            learning_goal_id = objective.learning_goal_id

            self.learning_goal_service.remove_objective_from_order(
                learning_goal_id, 
                objective_id, 
                session
            )

            self.mongo_service.delete_objective(learning_goal_id, objective_id)
            
            session.delete(objective)
            session.commit()

            return {"message": "Objective deleted successfully", "objective_id": objective_id}
        
        except APIException as api_error:
            raise api_error
        
        except Exception as err:
            session.rollback()
            handle_db_error(err, "delete_objective", error_type="commit")

    def add_task_to_status_order(self, objective_id: UUID, task_id: UUID, status: Status, session: Session):
        """Add a task to the appropriate status array in tasks_order_by_status"""
        try:
            objective = self.get_objective(objective_id, session)
            
            if objective.tasks_order_by_status is None:
                objective.tasks_order_by_status = {
                    "not_started": [],
                    "in_progress": [],
                    "completed": [],
                    "paused": [],
                }
            
            task_id_str = str(task_id)
            status_key = status.value.lower()
            
            for status_list in objective.tasks_order_by_status.values():
                if task_id_str in status_list:
                    return
            
            if status_key in objective.tasks_order_by_status:
                objective.tasks_order_by_status[status_key].append(task_id_str)
                objective.updated_at = datetime.now(timezone.utc)
                
                mongo_data = build_objective_document(objective)
                self.mongo_service.update_objective(
                    objective.learning_goal_id,
                    objective_id,
                    mongo_data
                )
                
        except APIException as api_error:
            raise api_error
        
        except Exception as err:
            handle_db_error(err, "add_task_to_status_order", error_type="update")

    def remove_task_from_status_order(self, objective_id: UUID, task_id: UUID, session: Session):
        """Remove a task from tasks_order_by_status arrays"""
        try:
            objective = self.get_objective(objective_id, session)
            
            if not objective.tasks_order_by_status:
                return 
            
            task_id_str = str(task_id)
            task_removed = False
            
            for status_list in objective.tasks_order_by_status.values():
                if task_id_str in status_list:
                    status_list.remove(task_id_str)
                    task_removed = True
                    break
            
            if not task_removed:
                return
            
            objective.updated_at = datetime.now(timezone.utc)
            
            mongo_data = build_objective_document(objective)
            self.mongo_service.update_objective(
                objective.learning_goal_id,
                objective_id,
                mongo_data
            )
                    
        except APIException as api_error:
            raise api_error
        
        except Exception as err:
            handle_db_error(err, "remove_task_from_status_order", error_type="update")

    def _calculate_total_pages(self, total: int, per_page: int) -> int:
        """Calculate total pages for pagination"""
        return (total + per_page - 1) // per_page if total > 0 else 0

    def _create_empty_kanban_columns(self, per_page: int) -> dict:
        """Create empty Kanban columns structure"""
        empty_column = {
            "page": 1,
            "per_page": per_page,
            "total": 0,
            "total_pages": 0,
            "has_next": False,
            "items": []
        }
        return {
            "columns": {
                "not_started": empty_column.copy(),
                "in_progress": empty_column.copy(),
                "completed": empty_column.copy(),
                "paused": empty_column.copy(),
            }
        }

    def _fetch_tasks_by_ids_ordered(self, task_ids_by_status: dict, per_page_per_status: dict, session: Session) -> dict:
        """
        Helper function to fetch tasks from database in a single query and return them organized by status.
        
        Args:
            task_ids_by_status: Dict with status as key and list of task IDs as value
            per_page_per_status: Dict with status as key and per_page limit as value
            session: Database session
            
        Returns:
            Dict with status as key and list of Task objects as value, maintaining original order
        """
        all_task_ids = set()
        column_data = {}
        
        for status, task_ids in task_ids_by_status.items():
            per_page = per_page_per_status.get(status, len(task_ids))
            page_task_ids = task_ids[:per_page]
            all_task_ids.update(page_task_ids)
            column_data[status] = page_task_ids
        
        task_dict = {}
        if all_task_ids:
            task_uuids = [UUID(task_id) for task_id in all_task_ids]
            db_tasks = session.exec(
                select(Task).where(Task.task_id.in_(task_uuids))
            ).all()
            
            for task in db_tasks:
                task_dict[str(task.task_id)] = task
        
        result = {}
        for status, page_task_ids in column_data.items():
            tasks = []
            for task_id in page_task_ids:
                if task_id in task_dict:
                    tasks.append(task_dict[task_id])
            result[status] = tasks
        
        return result

    def get_kanban_board(self, objective_id: UUID, per_page: int, session: Session) -> dict:
        """Get the full Kanban board for an objective with first page of each status"""
        try:
            objective = self.get_objective(objective_id, session)
            
            if not objective.tasks_order_by_status:
                return self._create_empty_kanban_columns(per_page)
            
            task_ids_by_status = {}
            per_page_per_status = {}
            column_metadata = {}
            
            for status in ["not_started", "in_progress", "completed", "paused"]:
                task_ids = objective.tasks_order_by_status.get(status, [])
                total = len(task_ids)
                total_pages = self._calculate_total_pages(total, per_page)
                has_next = total > per_page
                
                task_ids_by_status[status] = task_ids
                per_page_per_status[status] = per_page
                column_metadata[status] = {
                    "page": 1,
                    "per_page": per_page,
                    "total": total,
                    "total_pages": total_pages,
                    "has_next": has_next
                }
            
            tasks_by_status = self._fetch_tasks_by_ids_ordered(
                task_ids_by_status, 
                per_page_per_status, 
                session
            )
            
            columns = {}
            for status in ["not_started", "in_progress", "completed", "paused"]:
                columns[status] = {
                    **column_metadata[status],
                    "items": tasks_by_status[status]
                }
            
            return {"columns": columns}
            
        except APIException as api_error:
            raise api_error
        
        except Exception as err:
            handle_db_error(err, "get_kanban_board", error_type="query")

    def get_kanban_column(self, objective_id: UUID, status: str, page: int, per_page: int, session: Session) -> dict:
        """Get a specific page of tasks for a Kanban column"""
        try:
            objective = self.get_objective(objective_id, session)
            
            if not objective.tasks_order_by_status or status not in objective.tasks_order_by_status:
                return {
                    "status": status,
                    "page": page,
                    "per_page": per_page,
                    "total": 0,
                    "total_pages": 0,
                    "has_next": False,
                    "items": []
                }
            
            task_ids = objective.tasks_order_by_status[status]
            total = len(task_ids)
            total_pages = self._calculate_total_pages(total, per_page)
            
            start_idx = (page - 1) * per_page
            end_idx = start_idx + per_page
            has_next = end_idx < total
            
            page_task_ids = task_ids[start_idx:end_idx]
            
            tasks_by_status = self._fetch_tasks_by_ids_ordered(
                {status: page_task_ids},
                {status: len(page_task_ids)},
                session
            )
            tasks = tasks_by_status.get(status, [])
            
            return {
                "status": status,
                "page": page,
                "per_page": per_page,
                "total": total,
                "total_pages": total_pages,
                "has_next": has_next,
                "items": tasks
            }
            
        except APIException as api_error:
            raise api_error
        
        except Exception as err:
            handle_db_error(err, "get_kanban_column", error_type="query")