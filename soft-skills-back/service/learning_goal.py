from typing import Sequence
from datetime import datetime, timezone
from uuid import UUID

from enums.common import Status
from fastapi import Depends
from model.learning_goal import LearningGoal
from model.objective import Objective
from mongo_service.learning_goal import LearningGoalMongoService
from schema.learning_goal import LearningGoalCreate, LearningGoalUpdate, LearningGoalReadWithProgress
from sqlmodel import desc, Session, func, select
from sqlalchemy.sql import case
from utils.db import get_session
from utils.errors import APIException, Forbidden, Missing, handle_db_error
from utils.mongo_serializers import build_learning_goal_document


class LearningGoalService:
    def __init__(self):
        self.mongo_service = LearningGoalMongoService()

    def verify_user_ownership(self, learning_goal: LearningGoal, user_id: UUID):
        if learning_goal.user_id != user_id:
                raise Forbidden("You are not allowed to perform this action")
        
    def create_learning_goal(self, user_id: UUID, learning_goal: LearningGoalCreate, session: Session) -> LearningGoal:
        try:
            learning_goal_dict = learning_goal.model_dump()

            new_learning_goal = LearningGoal(**learning_goal_dict)
            new_learning_goal.user_id = user_id
            new_learning_goal.created_at = datetime.now(timezone.utc)
            new_learning_goal.updated_at = new_learning_goal.created_at

            mongo_data = build_learning_goal_document(new_learning_goal)
            self.mongo_service.create_learning_goal(mongo_data)
            
            session.add(new_learning_goal)
            session.commit()

            return new_learning_goal
        
        except Exception as err:
            session.rollback()
            handle_db_error(err, "create_learning_goal", error_type="commit")

    def __attach_objective_progress(
        self,
        goal: LearningGoal,
        session: Session
    ) -> LearningGoalReadWithProgress:
        
        summary = self._objectives_by_status(goal.learning_goal_id, session)

        return LearningGoalReadWithProgress(
            **goal.model_dump(),
            total_objectives=summary["total"],
            completed_objectives=summary["completed"]
        )

    def get_all_user_learning_goals(
            self,
            user_id: UUID,
            offset: int,
            limit: int, 
            session: Session = Depends(get_session),
        ) -> tuple[Sequence[LearningGoalReadWithProgress], int]:

        try:
            total_count = session.scalar(
                select(func.count()).where(LearningGoal.user_id == user_id)
            )

            user_learning_goals = session.exec(
                select(LearningGoal)
                .where(LearningGoal.user_id == user_id)
                .order_by(desc(LearningGoal.created_at))
                .offset(offset)
                .limit(limit)
            ).all()

            learning_goals = []
            for goal in user_learning_goals:
                learning_goal = self.__attach_objective_progress(goal, session)
                learning_goals.append(learning_goal)

            return learning_goals, total_count
        
        except Exception as err:
            handle_db_error(err, "get_all_user_learning_goals", error_type="query")

    def get_learning_goal(self, learning_goal_id: UUID, session: Session) -> LearningGoal:
        try:
            learning_goal = session.get(LearningGoal, learning_goal_id)

            if not learning_goal:
                raise Missing("Learning goal not found")
            
            return learning_goal
        
        except APIException as api_error:
            raise api_error

        except Exception as err:
            handle_db_error(err, "get_learning_goal", error_type="query")
    
    def _objectives_by_status(self, learning_goal_id: UUID, session: Session):
        try:
            completed_case = case((Objective.status == Status.COMPLETED, 1), else_=0)


            result = session.exec(
                select(
                    func.count().label("total"),
                    func.sum(completed_case).label("completed"),
                )
                .where(Objective.learning_goal_id == learning_goal_id)
            ).first()

            if result is None:
                return {
                    "total": 0,
                    "completed": 0,
                }

            total, completed = (result[0] or 0), (result[1] or 0)
            return {
                "total": total,
                "completed": completed,
            }
        
        except Exception as err:
            handle_db_error(err, "_tasks_by_status", error_type="query")

    def update_learning_goal(self, learning_goal_id: UUID, learning_goal: LearningGoalUpdate, user_id: UUID, session: Session) -> LearningGoal:
        try:
            existing_learning_goal = self.get_learning_goal(learning_goal_id, session)
            self.verify_user_ownership(existing_learning_goal, user_id)

            learning_goal_data = learning_goal.model_dump(exclude_unset=True)
            for key, value in learning_goal_data.items():
                setattr(existing_learning_goal, key, value)

            existing_learning_goal.updated_at = datetime.now(timezone.utc)

            mongo_data = build_learning_goal_document(existing_learning_goal)
            self.mongo_service.update_learning_goal(learning_goal_id, mongo_data)

            session.commit()

            return existing_learning_goal
        
        except APIException as api_error:
            raise api_error
        
        except Exception as err:
            session.rollback()
            handle_db_error(err, "update_learning_goal", error_type="commit")

    def add_objective_to_order(self, learning_goal_id: UUID, objective_id: UUID, session: Session):
        """Add an objective to the end of the objectives_order array"""
        try:
            learning_goal = self.get_learning_goal(learning_goal_id, session)
            
            if learning_goal.objectives_order is None:
                learning_goal.objectives_order = []
            
            objective_id_str = str(objective_id)
            if objective_id_str in learning_goal.objectives_order:
                return 
                
            learning_goal.objectives_order.append(objective_id_str)
            learning_goal.updated_at = datetime.now(timezone.utc)
            
            mongo_data = build_learning_goal_document(learning_goal)
            self.mongo_service.update_learning_goal(learning_goal_id, mongo_data)
                
        except APIException as api_error:
            raise api_error
        
        except Exception as err:
            handle_db_error(err, "add_objective_to_order", error_type="update")

    def remove_objective_from_order(self, learning_goal_id: UUID, objective_id: UUID, session: Session):
        """Remove an objective from the objectives_order array"""
        try:
            learning_goal = self.get_learning_goal(learning_goal_id, session)
            
            if not learning_goal.objectives_order:
                return
                
            objective_id_str = str(objective_id)
            if objective_id_str not in learning_goal.objectives_order:
                return 
                
            learning_goal.objectives_order.remove(objective_id_str)
            learning_goal.updated_at = datetime.now(timezone.utc)
            
            mongo_data = build_learning_goal_document(learning_goal)
            self.mongo_service.update_learning_goal(learning_goal_id, mongo_data)
                    
        except APIException as api_error:
            raise api_error
        
        except Exception as err:
            handle_db_error(err, "remove_objective_from_order", error_type="update")

    def delete_learning_goal(self, learning_goal_id: UUID, user_id: UUID, session: Session):
        try:
            learning_goal = self.get_learning_goal(learning_goal_id, session)
            self.verify_user_ownership(learning_goal, user_id)
            
            session.delete(learning_goal)
            self.mongo_service.delete_learning_goal(learning_goal_id)

            session.commit()

            return {"message": "Learning goal deleted successfully", "learning_goal_id": learning_goal_id}
        
        except APIException as api_error:
            raise api_error
        
        except Exception as err:
            session.rollback()
            handle_db_error(err, "delete_learning_goal", error_type="commit")