from typing import Dict
from datetime import datetime, timezone
from uuid import UUID

from enums.common import Status
from model.learning_goal import LearningGoal
from model.objective import Objective
from model.task import Task
from mongo_service.objective import ObjectiveMongoService
from schema.kanban import KanbanMoveRequest
from service.learning_goal import LearningGoalService
from service.objective import ObjectiveService
from sqlalchemy.sql import case
from sqlmodel import Session, func, select
from utils.errors import APIException, BadRequest, Missing, handle_db_error
from utils.mongo_serializers import build_objective_document


class KanbanService:
    def __init__(self):
        self.objective_service = ObjectiveService()
        self.learning_goal_service = LearningGoalService()
        self.mongo_service = ObjectiveMongoService()

    def get_kanban_board(self, objective_id: UUID, per_page: int, session: Session) -> dict:
        """Get the full Kanban board for an objective with first page of each status"""
        try:
            objective = self.objective_service.get_objective(objective_id, session)
            
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
            objective = self.objective_service.get_objective(objective_id, session)
            
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

    def move_kanban_task(self, objective_id: UUID, move_request: KanbanMoveRequest, user_id: UUID, session: Session) -> dict:
        """Move a task in the Kanban board with full validation and aggregate recomputation"""
        try:
            self.objective_service.verify_user_ownership(objective_id, user_id, session)
            
            objective = session.get(Objective, objective_id, with_for_update=True)
            if not objective:
                raise Missing("Objective not found")
            
            task = session.get(Task, move_request.task_id, with_for_update=True)
            if not task:
                raise Missing("Task not found")
            
            if task.objective_id != objective_id:
                raise BadRequest("Task does not belong to this objective")
            
            if move_request.from_column != task.status:
                raise BadRequest(f"Task is currently in '{task.status.value}', not '{move_request.from_column.value}'")
            
            if not objective.tasks_order_by_status:
                objective.tasks_order_by_status = {
                    "not_started": [],
                    "in_progress": [],
                    "completed": [],
                    "paused": [],
                }
            
            from_column_tasks = objective.tasks_order_by_status.get(move_request.from_column.value, [])
            to_column_tasks = objective.tasks_order_by_status.get(move_request.to_column.value, [])
            
            task_id_str = str(move_request.task_id)
            
            if move_request.from_column == move_request.to_column:
                max_position = len(from_column_tasks) - 1
                if move_request.new_position > max_position:
                    raise BadRequest(f"Position {move_request.new_position} is out of bounds. Max position after removal: {max_position}")
            else:
                max_position = len(to_column_tasks)
                if move_request.new_position > max_position:
                    raise BadRequest(f"Position {move_request.new_position} is out of bounds. Max position: {max_position}")
            
            old_position = from_column_tasks.index(task_id_str) if task_id_str in from_column_tasks else 0
            
            before_aggregates = self._compute_required_task_aggregates(objective_id, session)
            
            if move_request.from_column == move_request.to_column:
                self._reorder_task_in_column(objective, move_request, task_id_str)
            else:
                self._move_task_between_columns(objective, task, move_request, task_id_str, session)
            
            after_aggregates = self._compute_required_task_aggregates(objective_id, session)
            self._apply_objective_transitions(objective, before_aggregates, after_aggregates)
            
            if objective.learning_goal_id:
                self._recompute_learning_goal_status(objective.learning_goal_id, session)
            
            mongo_data = build_objective_document(objective)
            self.mongo_service.update_objective(objective.learning_goal_id, objective_id, mongo_data)
            
            session.commit()
            
            return {
                "message": "Task moved successfully",
                "task": {
                    "id": str(move_request.task_id),
                    "status": move_request.to_column.value,
                    "column": move_request.to_column.value,
                    "position": move_request.new_position
                },
                "old": {
                    "id": str(move_request.task_id),
                    "status": move_request.from_column.value,
                    "column": move_request.from_column.value,
                    "position": old_position
                }
            }
            
        except APIException as api_error:
            session.rollback()
            raise api_error
        
        except Exception as err:
            session.rollback()
            handle_db_error(err, "move_kanban_task", error_type="commit")

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

    def _reorder_task_in_column(self, objective: Objective, move_request: KanbanMoveRequest, task_id_str: str):
        """Handle reordering within the same column"""
        # Create a copy to force SQLAlchemy to detect changes
        tasks_order = objective.tasks_order_by_status.copy()
        column_tasks = tasks_order[move_request.to_column.value].copy()
        
        if task_id_str in column_tasks:
            column_tasks.remove(task_id_str)
        
        column_tasks.insert(move_request.new_position, task_id_str)
        
        # Reassign to trigger SQLAlchemy change detection
        tasks_order[move_request.to_column.value] = column_tasks
        objective.tasks_order_by_status = tasks_order
        
        objective.updated_at = datetime.now(timezone.utc)

    def _move_task_between_columns(self, objective: Objective, task: Task, move_request: KanbanMoveRequest, task_id_str: str, session: Session):
        """Handle moving task between different columns"""
        now = datetime.now(timezone.utc)
        
        tasks_order = objective.tasks_order_by_status.copy()
        
        from_column_tasks = tasks_order[move_request.from_column.value].copy()
        if task_id_str in from_column_tasks:
            from_column_tasks.remove(task_id_str)
        tasks_order[move_request.from_column.value] = from_column_tasks
        
        to_column_tasks = tasks_order[move_request.to_column.value].copy()
        to_column_tasks.insert(move_request.new_position, task_id_str)
        tasks_order[move_request.to_column.value] = to_column_tasks
        
        objective.tasks_order_by_status = tasks_order
        
        task.status = move_request.to_column
        task.updated_at = now
        
        if move_request.to_column == Status.IN_PROGRESS:
            if task.started_at is None:
                task.started_at = now
            task.completed_at = None

        elif move_request.to_column == Status.PAUSED:
            if task.started_at is None:
                task.started_at = now

        elif move_request.to_column == Status.NOT_STARTED:
            task.started_at = None
            task.completed_at = None
            
        elif move_request.to_column == Status.COMPLETED:
            if task.started_at is None:
                task.started_at = now
            if task.completed_at is None:
                task.completed_at = now
        
        objective.updated_at = now

    def _compute_required_task_aggregates(self, objective_id: UUID, session: Session) -> dict:
        """Compute aggregates for required tasks only"""
        try:
            result = session.exec(
                select(
                    func.count().label("required_total"),
                    func.sum(
                        case(
                            (Task.status == Status.COMPLETED, 1), 
                            else_=0
                        )
                    ).label("required_done"),
                    func.sum(
                        case(
                            (
                                Task.status.in_([Status.IN_PROGRESS, Status.PAUSED, Status.COMPLETED]), 1), 
                                else_=0
                            )
                    ).label("required_active")
                )
                .where(Task.objective_id == objective_id)
                .where(Task.is_optional == False)
            ).first()
            
            if not result:
                return {"required_total": 0, "required_done": 0, "required_active": 0}
            
            return {
                "required_total": result[0] or 0,
                "required_done": result[1] or 0,
                "required_active": result[2] or 0
            }
            
        except Exception as err:
            handle_db_error(err, "_compute_required_task_aggregates", error_type="query")

    def _apply_objective_transitions(self, objective: Objective, before: dict, after: dict):
        """Apply objective status transitions based on aggregate changes"""
        now = datetime.now(timezone.utc)
        
        if (before["required_done"] == before["required_total"] and before["required_total"] > 0 and
            after["required_done"] < after["required_total"]):
            objective.status = Status.IN_PROGRESS
            objective.completed_at = None
        
        if after["required_done"] == after["required_total"] and after["required_total"] > 0:
            objective.status = Status.COMPLETED
            if objective.completed_at is None:
                objective.completed_at = now
        
        if after["required_active"] > 0 and before["required_active"] == 0:
            objective.status = Status.IN_PROGRESS
            if objective.started_at is None:
                objective.started_at = now
           
        if after["required_active"] == 0:
            objective.status = Status.NOT_STARTED

    def _recompute_learning_goal_status(self, learning_goal_id: UUID, session: Session):
        """Recompute and apply learning goal status transitions"""
        try:
            learning_goal = session.get(LearningGoal, learning_goal_id, with_for_update=True)
            if not learning_goal:
                return
            
            result = session.exec(
                select(
                    func.count().label("total_required"),
                    func.sum(
                        case(
                            (Objective.status == Status.COMPLETED, 1), 
                            else_=0
                        )
                    ).label("completed_required"),
                    func.sum(
                        case(
                            (Objective.status.in_([Status.IN_PROGRESS, Status.PAUSED, Status.COMPLETED]), 1), 
                            else_=0
                        )
                    ).label("active_required")
                )
                .where(Objective.learning_goal_id == learning_goal_id)
            ).first()
            
            if not result:
                return
            
            total_required = result[0] or 0
            completed_required = result[1] or 0
            active_required = result[2] or 0
            
            now = datetime.now(timezone.utc)
            
            if active_required > 0 and learning_goal.started_at is None:
                learning_goal.started_at = now
            
            if completed_required == total_required and total_required > 0:
                if learning_goal.completed_at is None:
                    learning_goal.completed_at = now
            else:
                learning_goal.completed_at = None
            
            
        except Exception as err:
            handle_db_error(err, "_recompute_learning_goal_status", error_type="update")

    def sync_kanban_with_task_statuses(self, objective_id: UUID, session: Session) -> dict:
        """Sync the kanban board ordering with actual task statuses"""
        try:
            objective = self.objective_service.get_objective(objective_id, session)
            
            tasks = session.exec(
                select(Task).where(Task.objective_id == objective_id)
            ).all()
            
            new_ordering = {
                "not_started": [],
                "in_progress": [],
                "completed": [],
                "paused": [],
            }
            
            for task in tasks:
                status_key = task.status.value.lower()
                if status_key in new_ordering:
                    new_ordering[status_key].append(str(task.task_id))
            
            objective.tasks_order_by_status = new_ordering
            objective.updated_at = datetime.now(timezone.utc)
            
            mongo_data = build_objective_document(objective)
            self.mongo_service.update_objective(objective.learning_goal_id, objective_id, mongo_data)
            
            session.commit()
            
            return {
                "message": "Kanban board synced with task statuses",
                "synced_tasks": len(tasks),
                "new_ordering": new_ordering
            }
            
        except APIException as api_error:
            session.rollback()
            raise api_error
        
        except Exception as err:
            session.rollback()
            handle_db_error(err, "sync_kanban_with_task_statuses", error_type="commit")
