from typing import List
from uuid import UUID

from model.learning_goal import LearningGoal
from model.objective import Objective
from model.task import Task
from model.task_resource import TaskResource
from schema.task_resource import TaskResourceCreate, TaskResourceRead, TaskResourceUpdate
from service.task import TaskService
from sqlmodel import Session, select
from utils.errors import APIException, Forbidden, Missing, handle_db_error


class TaskResourceService:
    def __init__(self):
        self.task_service = TaskService()

    def verify_user_ownership(self, task_id: UUID, user_id: UUID, session: Session):
        """Verify that the user owns the task"""
        try:
            statement = (
                select(LearningGoal.user_id)
                .join(Objective, Objective.learning_goal_id == LearningGoal.learning_goal_id)
                .join(Task, Task.objective_id == Objective.objective_id)
                .where(Task.task_id == task_id)
            )
            
            task_owner_id = session.exec(statement).first()

            if task_owner_id != user_id:
                raise Forbidden("No tiene permiso para modificar este recurso")
            
        except APIException as api_error:
            raise api_error
        
        except Exception as err:
            handle_db_error(err, "verify_user_ownership", error_type="query")

    def create_task_resource(self, task_id: UUID, resource: TaskResourceCreate, user_id: UUID, session: Session) -> TaskResourceRead:
        """Create a new resource for a task"""
        try:
            self.verify_user_ownership(task_id, user_id, session)
            
            resource_dict = resource.model_dump()
            new_resource = TaskResource(**resource_dict, task_id=task_id)

            session.add(new_resource)
            session.commit()

            return TaskResourceRead.model_validate(new_resource)

        except APIException as api_error:
            raise api_error
        
        except Exception as err:
            session.rollback()
            handle_db_error(err, "create_task_resource", error_type="commit")

    def get_task_resources(self, task_id: UUID, user_id: UUID, session: Session) -> List[TaskResourceRead]:
        """Get all resources for a task"""
        try:
            self.verify_user_ownership(task_id, user_id, session)
            
            resources = session.exec(
                select(TaskResource)
                .where(TaskResource.task_id == task_id)
                .order_by(TaskResource.created_at.desc())
            ).all()

            return [TaskResourceRead.model_validate(resource) for resource in resources]

        except APIException as api_error:
            raise api_error
        
        except Exception as err:
            handle_db_error(err, "get_task_resources", error_type="query")

    def get_task_resource(self, task_id: UUID, resource_id: UUID, user_id: UUID, session: Session) -> TaskResource:
        """Get a specific resource by ID"""
        try:
            self.verify_user_ownership(task_id, user_id, session)
            
            resource = session.exec(
                select(TaskResource)
                .where(TaskResource.resource_id == resource_id)
                .where(TaskResource.task_id == task_id)
            ).first()

            if not resource:
                raise Missing("Recurso no encontrado")
            
            return resource

        except APIException as api_error:
            raise api_error
        
        except Exception as err:
            handle_db_error(err, "get_task_resource", error_type="query")

    def update_task_resource(self, task_id: UUID, resource_id: UUID, resource: TaskResourceUpdate, user_id: UUID, session: Session) -> TaskResourceRead:
        """Update a task resource"""
        try:
            existing_resource = self.get_task_resource(task_id, resource_id, user_id, session)

            resource_data = resource.model_dump(exclude_unset=True)
            for key, value in resource_data.items():
                setattr(existing_resource, key, value)

            session.commit()

            return TaskResourceRead.model_validate(existing_resource)

        except APIException as api_error:
            raise api_error
        
        except Exception as err:
            session.rollback()
            handle_db_error(err, "update_task_resource", error_type="commit")

    def delete_task_resource(self, task_id: UUID, resource_id: UUID, user_id: UUID, session: Session):
        """Delete a task resource"""
        try:
            resource = self.get_task_resource(task_id, resource_id, user_id, session)

            session.delete(resource)
            session.commit()

            return {"message": "Recurso eliminado correctamente", "resource_id": resource_id}

        except APIException as api_error:
            raise api_error
        
        except Exception as err:
            session.rollback()
            handle_db_error(err, "delete_task_resource", error_type="commit")

