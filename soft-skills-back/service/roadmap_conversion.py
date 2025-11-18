from datetime import datetime, timezone
from uuid import UUID

from enums.common import Priority, Status
from enums.task import TaskType
from enums.resource import ResourceType
from model.learning_goal import LearningGoal
from model.objective import Objective
from model.task import Task
from model.task_resource import TaskResource
from mongo_service.roadmap import RoadmapMongoService
from schema.learning_goal import LearningGoalCreate
from schema.objective import ObjectiveCreate
from schema.task import TaskCreate
from service.learning_goal import LearningGoalService
from service.objective import ObjectiveService
from service.task import TaskService
from sqlmodel import Session
from utils.errors import APIException, handle_db_error


class RoadmapConversionService:
    def __init__(self):
        self.roadmap_mongo_service = RoadmapMongoService()
        self.learning_goal_service = LearningGoalService()
        self.objective_service = ObjectiveService()
        self.task_service = TaskService()

    def _parse_task_type(self, roadmap_task_type) -> TaskType:
        """Parse task type from roadmap, defaulting to OTHER if invalid"""
        if not roadmap_task_type:
            return TaskType.OTHER
        
        try:
            return TaskType(roadmap_task_type.value)
        except (ValueError, AttributeError):
            return TaskType.OTHER

    def _parse_resource_type(self, roadmap_resource_type) -> ResourceType:
        """Parse resource type from roadmap, defaulting to OTHER if invalid"""
        try:
            return ResourceType(roadmap_resource_type.value)
        except (ValueError, AttributeError):
            return ResourceType.OTHER

    def _create_task_resources(self, task: Task, roadmap_resources: list, session: Session):
        """Create TaskResource objects for a task from roadmap resources"""
        for roadmap_resource in roadmap_resources:
            resource_type = self._parse_resource_type(roadmap_resource.type)
            
            task_resource = TaskResource(
                task_id=task.task_id,
                type=resource_type,
                title=roadmap_resource.title,
                link=str(roadmap_resource.url)
            )
            session.add(task_resource)

    def _create_roadmap_task(self, objective: Objective, roadmap_task, user_id: UUID, session: Session) -> Task:
        """Create a Task from a roadmap task with default values"""
        task_type = self._parse_task_type(roadmap_task.type)
        
        task_data = TaskCreate(
            objective_id=objective.objective_id,
            title=roadmap_task.title,
            description=roadmap_task.description or "",
            task_type=task_type,
            status=Status.NOT_STARTED,
            priority=Priority.MEDIUM,
            estimated_seconds=0,
            due_date=None,
            is_optional=False
        )
        return self.task_service.create_task(task_data, user_id, session)

    def _create_roadmap_objective_tasks(self, objective: Objective, roadmap_objective, user_id: UUID, session: Session):
        """Create all tasks for an objective from roadmap"""
        for roadmap_task in roadmap_objective.tasks:
            task = self._create_roadmap_task(objective, roadmap_task, user_id, session)
            self._create_task_resources(task, roadmap_task.resources, session)

    def _create_roadmap_objective(self, learning_goal: LearningGoal, roadmap_objective, session: Session) -> Objective:
        """Create an Objective from a roadmap objective with default values"""
        objective_data = ObjectiveCreate(
            learning_goal_id=learning_goal.learning_goal_id,
            title=roadmap_objective.title,
            description=roadmap_objective.description or "",
            status=Status.NOT_STARTED,
            priority=Priority.MEDIUM,
            due_date=None
        )
        return self.objective_service.create_objective(objective_data, session)

    def _create_roadmap_objectives(self, learning_goal: LearningGoal, roadmap, user_id: UUID, session: Session):
        """Create all objectives, tasks, and resources from roadmap"""
        for roadmap_objective in roadmap.objectives:
            objective = self._create_roadmap_objective(learning_goal, roadmap_objective, session)
            self._create_roadmap_objective_tasks(objective, roadmap_objective, user_id, session)

    def convert_roadmap_to_learning_goal(self, roadmap_id: str, user_id: UUID, session: Session) -> dict:
        """Convert a roadmap to a learning goal with objectives, tasks, and resources"""
        try:
            roadmap = self.roadmap_mongo_service.get_roadmap_by_id(roadmap_id)
            
            learning_goal_data = LearningGoalCreate(
                title=roadmap.title,
                description=roadmap.description,
                impact=None
            )
            learning_goal = self.learning_goal_service.create_learning_goal(user_id, learning_goal_data, session)
            
            self._create_roadmap_objectives(learning_goal, roadmap, user_id, session)
            
            session.commit()
            
            return {
                "message": "Plan de aprendizaje convertido en meta de aprendizaje correctamente",
                "learning_goal_id": str(learning_goal.learning_goal_id)
            }
        
        except APIException as api_error:
            raise api_error
        
        except Exception as err:
            session.rollback()
            handle_db_error(err, "convert_roadmap_to_learning_goal", error_type="conversion")

