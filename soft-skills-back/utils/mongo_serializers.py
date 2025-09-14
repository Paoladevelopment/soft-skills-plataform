from typing import Any, Dict

from model.learning_goal import LearningGoal
from model.objective import Objective
from model.task import Task


def build_learning_goal_document(model: LearningGoal) -> Dict[str, Any]:
    return {
        "learning_goal_id": str(model.learning_goal_id),
        "title": model.title,
        "description": model.description,
        "impact": model.impact,
        "user_id": str(model.user_id),
        "objectives_order": [str(objective_id) for objective_id in (model.objectives_order or [])],
        "created_at": model.created_at,
        "updated_at": model.updated_at,
        "started_at": model.started_at,
        "completed_at": model.completed_at,
    }

def build_objective_document(model: Objective) -> Dict[str, Any]:
    return {
        "objective_id": str(model.objective_id),
        "learning_goal_id": str(model.learning_goal_id),
        "title": model.title,
        "description": model.description,
        "status": model.status.value,
        "priority": model.priority.value,
        "due_date": model.due_date,
        "tasks_order_by_status": model.tasks_order_by_status,
        "created_at": model.created_at,
        "updated_at": model.updated_at,
        "started_at": model.started_at,
        "completed_at": model.completed_at,
    }

def build_task_document(model: Task) -> Dict[str, Any]:
    return {
        "task_id": str(model.task_id),
        "objective_id": str(model.objective_id),
        "title": model.title,
        "description": model.description,
        "task_type": model.task_type.value,
        "status": model.status.value,
        "priority": model.priority.value,
        "estimated_seconds": model.estimated_seconds,
        "actual_seconds": model.actual_seconds,
        "pomodoro_length_seconds_snapshot": model.pomodoro_length_seconds_snapshot,
        "estimated_pomodoros_snapshot": model.estimated_pomodoros_snapshot,
        "due_date": model.due_date,
        "is_optional": model.is_optional,
        "created_at": model.created_at,
        "updated_at": model.updated_at,
        "started_at": model.started_at,
        "completed_at": model.completed_at,
        "estimated_minutes": model.estimated_minutes,
        "actual_minutes": model.actual_minutes,
        "estimated_pomodoros": model.estimated_pomodoros,
        "actual_pomodoros": model.actual_pomodoros,
    }