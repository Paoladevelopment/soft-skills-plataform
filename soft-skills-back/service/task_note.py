from typing import List
from uuid import UUID

from model.learning_goal import LearningGoal
from model.objective import Objective
from model.task import Task
from model.task_note import TaskNote
from schema.task_note import TaskNoteCreate, TaskNoteRead, TaskNoteUpdate
from service.task import TaskService
from sqlmodel import Session, select
from utils.errors import APIException, Forbidden, Missing, handle_db_error


class TaskNoteService:
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
                raise Forbidden("No tiene permiso para modificar esta nota")
            
        except APIException as api_error:
            raise api_error
        
        except Exception as err:
            handle_db_error(err, "verify_user_ownership", error_type="query")

    def create_task_note(self, task_id: UUID, note: TaskNoteCreate, user_id: UUID, session: Session) -> TaskNoteRead:
        """Create a new note for a task"""
        try:
            self.verify_user_ownership(task_id, user_id, session)
            
            note_dict = note.model_dump()
            new_note = TaskNote(**note_dict, task_id=task_id)

            session.add(new_note)
            session.commit()

            return TaskNoteRead.model_validate(new_note)

        except APIException as api_error:
            raise api_error
        
        except Exception as err:
            session.rollback()
            handle_db_error(err, "create_task_note", error_type="commit")

    def get_task_notes(self, task_id: UUID, user_id: UUID, session: Session) -> List[TaskNoteRead]:
        """Get all notes for a task"""
        try:
            self.verify_user_ownership(task_id, user_id, session)
            
            notes = session.exec(
                select(TaskNote)
                .where(TaskNote.task_id == task_id)
                .order_by(TaskNote.created_at.desc())
            ).all()

            return [TaskNoteRead.model_validate(note) for note in notes]

        except APIException as api_error:
            raise api_error
        
        except Exception as err:
            handle_db_error(err, "get_task_notes", error_type="query")

    def get_task_note(self, task_id: UUID, note_id: UUID, user_id: UUID, session: Session) -> TaskNote:
        """Get a specific note by ID"""
        try:
            self.verify_user_ownership(task_id, user_id, session)
            
            note = session.exec(
                select(TaskNote)
                .where(TaskNote.note_id == note_id)
                .where(TaskNote.task_id == task_id)
            ).first()

            if not note:
                raise Missing("Nota no encontrada")
            
            return note

        except APIException as api_error:
            raise api_error
        
        except Exception as err:
            handle_db_error(err, "get_task_note", error_type="query")

    def update_task_note(self, task_id: UUID, note_id: UUID, note: TaskNoteUpdate, user_id: UUID, session: Session) -> TaskNoteRead:
        """Update a task note"""
        try:
            existing_note = self.get_task_note(task_id, note_id, user_id, session)

            note_data = note.model_dump(exclude_unset=True)
            for key, value in note_data.items():
                setattr(existing_note, key, value)

            session.commit()

            return TaskNoteRead.model_validate(existing_note)

        except APIException as api_error:
            raise api_error
        
        except Exception as err:
            session.rollback()
            handle_db_error(err, "update_task_note", error_type="commit")

    def delete_task_note(self, task_id: UUID, note_id: UUID, user_id: UUID, session: Session):
        """Delete a task note"""
        try:
            note = self.get_task_note(task_id, note_id, user_id, session)

            session.delete(note)
            session.commit()

            return {"message": "Nota eliminada correctamente", "note_id": note_id}

        except APIException as api_error:
            raise api_error
        
        except Exception as err:
            session.rollback()
            handle_db_error(err, "delete_task_note", error_type="commit")

