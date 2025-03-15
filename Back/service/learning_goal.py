from typing import Sequence
from uuid import UUID

from fastapi import Depends
from sqlalchemy.sql import case
from sqlmodel import Session, func, select

from enums.common import Status
from model.learning_goal import LearningGoal
from model.objective import Objective
from schema.learning_goal import LearningGoalCreate, LearningGoalUpdate
from utils.db import get_session
from utils.errors import APIException, Forbidden, Missing, handle_db_error


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
        
        except Exception as err:
            session.rollback()
            handle_db_error(err, "create_learning_goal", error_type="commit")
        

    def get_all_user_learning_goals(
            self,
            user_id: UUID,
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
        
        except Exception as err:
            handle_db_error(err, "get_all_user_learning_goals", error_type="query")

    def get_learning_goal(self, learning_goal_id: UUID, session: Session) -> LearningGoal:
        try:
            learning_goal = session.get(LearningGoal, learning_goal_id)

            if not learning_goal:
                raise Missing("Learning goal not found")
            
            _ = learning_goal.objectives
            
            return learning_goal
        
        except APIException as api_error:
            raise api_error

        except Exception as err:
            handle_db_error(err, "get_learning_goal", error_type="query")

    def _objectives_by_status(self, learning_goal_id: UUID, session: Session):
        try:
            completed_case = case((Objective.status == Status.COMPLETED, 1), else_=0)
            in_progress_case = case((Objective.status == Status.IN_PROGRESS, 1), else_=0)
            paused_case = case((Objective.status == Status.PAUSED, 1), else_=0)

            result = session.exec(
                select(
                    func.count().label("total"),
                    func.sum(completed_case).label("completed"),
                    func.sum(in_progress_case).label("in_progress"),
                    func.sum(paused_case).label("paused")
                )
                .where(Objective.learning_goal_id == learning_goal_id)
            ).first()

            if result is None:
                raise Missing(f"No objectives found for learning goal ID {learning_goal_id}")

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
            handle_db_error(err, "_objectives_by_status", error_type="query")

    def update_learning_goal(self, learning_goal_id: UUID, learning_goal: LearningGoalUpdate, user_id: UUID, session: Session) -> LearningGoal:
        try:
            learning_goal_to_update = self.get_learning_goal(learning_goal_id, session)
            self.verify_user_ownership(learning_goal_to_update, user_id)

            learning_goal_data = learning_goal.model_dump(exclude_unset=True)
            for key, value in learning_goal_data.items():
                setattr(learning_goal_to_update, key, value)

            session.commit()
            session.refresh(learning_goal_to_update)

            return learning_goal_to_update
        
        except APIException as api_error:
            raise api_error
        
        except Exception as err:
            session.rollback()
            handle_db_error(err, "update_learning_goal", error_type="commit")
    
    def update_status(self, learning_goal_id: UUID, session: Session):
        try:
            task_counts = self._objectives_by_status(learning_goal_id, session)

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
        
            learning_goal = self.get_learning_goal(learning_goal_id, session)

            if learning_goal.status != new_status:
                learning_goal.status = new_status
                session.commit()

        except APIException as api_error:
            raise api_error

        except Exception as err:
            session.rollback()
            handle_db_error(err, "update_status", error_type="commit")

    def delete_learning_goal(self, learning_goal_id: UUID, user_id: UUID, session: Session):
        try:
            learning_goal = self.get_learning_goal(learning_goal_id, session)
            self.verify_user_ownership(learning_goal, user_id)
            
            session.delete(learning_goal)
            session.commit()

            return {"message": "Learning goal deleted successfully", "learning_goal_id": learning_goal_id}
        
        except APIException as api_error:
            raise api_error
        
        except Exception as err:
            session.rollback()
            handle_db_error(err, "delete_learning_goal", error_type="commit")