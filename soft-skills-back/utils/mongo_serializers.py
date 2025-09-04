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
        "order_index": model.order_index,
        "task_order": [str(task_id) for task_id in (model.task_order or [])],
        "created_at": model.created_at,
        "updated_at": model.updated_at,
        "started_at": model.started_at,
        "completed_at": model.completed_at,
    }

def build_task_document(model: Task) -> Dict[str, Any]:
    return {
        "task_id": str(model.task_id),
        "title": model.title,
        "description": model.description,
        "task_type": model.task_type.value,
        "status": model.status.value,
        "priority": model.priority.value,
        "estimated_time": model.estimated_time,
        "actual_time": model.actual_time,
        "due_date": model.due_date,
        "order_index": model.order_index,
        "is_optional": model.is_optional,
        "updated_at": model.updated_at,
        "started_at": model.started_at,
        "completed_at": model.completed_at,
    }