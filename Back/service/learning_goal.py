from uuid import UUID
from typing import Sequence
from fastapi import Depends
from sqlmodel import Session, select, func
from utils.db import get_session
from utils.errors import Missing, Forbidden, APIException, handle_db_error
from model.learning_goal import LearningGoal
from schema.learning_goal import LearningGoalCreate, LearningGoalUpdate

class LearningGoalService:
    def verify_user_ownership(self, learning_goal: LearningGoal, user_id: UUID):
        if learning_goal.user_id != user_id:
                raise Forbidden("You are not allowed to perform this action")
        
    def create_learning_goal(self, user_id: UUID, learning_goal: LearningGoalCreate, session: Session) -> LearningGoal:
        try:
            learning_goal_dict = learning_goal.model_dump()

            new_learning_goal = LearningGoal(**learning_goal_dict)

            new_learning_goal.user_id = user_id
            
            session.add(new_learning_goal)
            session.commit()
            session.refresh(new_learning_goal)
            return new_learning_goal
        
        except Exception as exc:
            session.rollback()
            handle_db_error(exc, "create_learning_goal", error_type="commit")
        

    def get_all_user_learning_goals(
            self,
            user_id: str,
            offset: int,
            limit: int, 
            session: Session = Depends(get_session),
        ) -> tuple[Sequence[LearningGoal], int]:

        try:
            total_count = session.scalar(
                select(func.count()).where(LearningGoal.user_id == user_id)
            )

            user_learning_goals = session.exec(
                select(LearningGoal).
                where(LearningGoal.user_id == user_id).
                offset(offset).
                limit(limit)
            ).all()

            return user_learning_goals, total_count
        
        except Exception as exc:
            handle_db_error(exc, "get_all_user_learning_goals", error_type="query")

    def get_learning_goal(self, learning_goal_id: str, session: Session) -> LearningGoal:
        try:
            learning_goal = session.get(LearningGoal, learning_goal_id)

            if not learning_goal:
                raise Missing("Learning goal not found")
            return learning_goal
        
        except APIException:
            raise

        except Exception as exc:
            handle_db_error(exc, "get_learning_goal", error_type="query")

    def update_learning_goal(self, learning_goal_id: str, learning_goal: LearningGoalUpdate, user_id: UUID, session: Session) -> LearningGoal:
        try:
            learning_goal_to_update = self.get_learning_goal(learning_goal_id, session)
            self.verify_user_ownership(learning_goal_to_update, user_id)

        except APIException:
            raise
                
        except Exception as exc:
            handle_db_error(exc, "update_learning_goal", error_type="query") 

        try:
            learning_goal_data = learning_goal.model_dump(exclude_unset=True)
            for key, value in learning_goal_data.items():
                setattr(learning_goal_to_update, key, value)

            session.commit()
            session.refresh(learning_goal_to_update)

            return learning_goal_to_update
        
        except Exception as exc:
            session.rollback()
            handle_db_error(exc, "update_learning_goal", error_type="commit")


    def delete_learning_goal(self, learning_goal_id: str, user_id: UUID, session: Session):
        try:
            learning_goal = self.get_learning_goal(learning_goal_id, session)
            self.verify_user_ownership(learning_goal, user_id)
            
        except APIException:
            raise
            
        except Exception as exc:
            handle_db_error(exc, "delete_learning_goal", error_type="query")

        try:
            session.delete(learning_goal)
            session.commit()

            return {"message": "Learning goal deleted successfully", "learning_goal_id": learning_goal_id}
        
        except Exception as exc:
            session.rollback()
            handle_db_error(exc, "delete_learning_goal", error_type="commit")