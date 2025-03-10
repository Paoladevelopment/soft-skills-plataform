from typing import Sequence
from uuid import UUID

from fastapi import Depends
from sqlalchemy import asc, desc
from sqlmodel import Session, func, select

from model.learning_goal import LearningGoal
from model.objective import Objective
from schema.objective import ObjectiveCreate, ObjectiveUpdate
from utils.db import get_session
from utils.errors import APIException, Forbidden, Missing, handle_db_error


class ObjectiveService:
    def verify_user_ownership(self, objective_id: UUID, user_id: UUID, session: Session):
        statement = (
            select(LearningGoal.user_id)
            .join(Objective, Objective.learning_goal_id == LearningGoal.learning_goal_id)
            .where(Objective.objective_id == objective_id)
        )
        
        result = session.exec(statement).first()
        learning_goal_owner_id = result[0] if result else None

        if learning_goal_owner_id != user_id:
            raise Forbidden("You are not allowed to modify this objective")
  
        
    def create_objective(self, objective: ObjectiveCreate, session: Session) -> Objective:
        try:
            objective_dict = objective.model_dump()

            new_objective = Objective(**objective_dict)
            
            session.add(new_objective)
            session.commit()
            session.refresh(new_objective)
            return new_objective
        
        except Exception as exc:
            session.rollback()
            handle_db_error(exc, "create_objective", error_type="commit")
        

    def get_objectives_by_learning_goal(
            self,
            learning_goal_id: str,
            offset: int,
            limit: int, 
            status: str = None,
            priority: str = None,
            session: Session = Depends(get_session),
        ) -> tuple[Sequence[Objective], int]:

        try:

            statement = (
                select(Objective).
                where(Objective.learning_goal_id == learning_goal_id)
                .order_by(desc(Objective.priority), asc(Objective.status))
            )

            count_statement = select(func.count()).where(Objective.learning_goal_id == learning_goal_id)

            if status:
                statement = statement.where(Objective.status == status)
                count_statement = count_statement.where(Objective.status == status)
            
            if priority:
                statement = statement.where(Objective.priority == priority)
                count_statement = count_statement.where(Objective.priority == priority)

            total_count = session.scalar(count_statement)

            objectives = session.exec(
                statement.
                offset(offset).
                limit(limit)
            ).all()

            return objectives, total_count
        
        except Exception as exc:
            handle_db_error(exc, "get_objectives_by_learning_goal", error_type="query")

    def get_objective(self, objective_id: UUID, session: Session) -> Objective:
        try:
            objective = session.get(Objective, objective_id)

            if not objective:
                raise Missing("Objective not found")
            return objective
        
        except APIException:
            raise

        except Exception as exc:
            handle_db_error(exc, "get_objective", error_type="query")

    def update_objective(self, objective_id: str, objective: ObjectiveUpdate, user_id: UUID, session: Session) -> Objective:
        try:
            existing_objective = self.get_objective(UUID(objective_id), session)
            self.verify_user_ownership(UUID(objective_id), user_id, session)

        except APIException:
            raise
                
        except Exception as exc:
            handle_db_error(exc, "update_objective", error_type="query") 

        try:
            objective_data = objective.model_dump(exclude_unset=True)
            for key, value in objective_data.items():
                setattr(existing_objective, key, value)

            session.commit()
            session.refresh(existing_objective)

            return existing_objective
        
        except Exception as exc:
            session.rollback()
            handle_db_error(exc, "uupdate_objective", error_type="commit")


    def delete_objective(self, objective_id: str, user_id: UUID, session: Session):
        try:
            objective = self.get_objective(UUID(objective_id), session)
            self.verify_user_ownership(UUID(objective_id), user_id, session)
            
        except APIException:
            raise
            
        except Exception as exc:
            handle_db_error(exc, "delete_objective", error_type="query")

        try:
            session.delete(objective)
            session.commit()

            return {"message": "Objective deleted successfully", "objective_id": objective_id}
        
        except Exception as exc:
            session.rollback()
            handle_db_error(exc, "delete_objective", error_type="commit")