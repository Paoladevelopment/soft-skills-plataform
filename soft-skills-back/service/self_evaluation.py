"""
Service layer for SelfEvaluation operations.
"""
from uuid import UUID
from typing import List, Optional, Tuple
from sqlmodel import Session, select, func

from model.self_evaluation import SelfEvaluation
from schema.self_evaluation import SelfEvaluationCreate, SelfEvaluationRead
from utils.errors import APIException, Missing, handle_db_error


class SelfEvaluationService:
    """Service for managing self-evaluations."""
    
    def has_evaluation_for_task(
        self,
        task_id: UUID,
        user_id: UUID,
        session: Session
    ) -> bool:
        """Check if a self-evaluation exists for a task and user."""
        try:
            statement = select(SelfEvaluation).where(
                SelfEvaluation.task_id == task_id,
                SelfEvaluation.user_id == user_id
            )
            evaluation = session.exec(statement).first()
            return evaluation is not None
            
        except Exception as err:
            handle_db_error(err, "has_evaluation_for_task", error_type="query")
    
    def create_evaluation(
        self,
        evaluation_data: SelfEvaluationCreate,
        user_id: UUID,
        session: Session
    ) -> SelfEvaluation:
        """Create a new self-evaluation."""
        try:
            new_evaluation = SelfEvaluation(
                **evaluation_data.model_dump(),
                user_id=user_id
            )
            
            session.add(new_evaluation)
            session.commit()
            session.refresh(new_evaluation)
            
            return new_evaluation
            
        except APIException as api_error:
            raise api_error
        except Exception as err:
            session.rollback()
            handle_db_error(err, "create_evaluation", error_type="commit")
    
    def get_evaluation_by_id(
        self,
        evaluation_id: UUID,
        session: Session
    ) -> SelfEvaluation:
        """Get a self-evaluation by ID."""
        try:
            statement = select(SelfEvaluation).where(
                SelfEvaluation.evaluation_id == evaluation_id
            )
            evaluation = session.exec(statement).first()
            
            if not evaluation:
                raise Missing(f"Self-evaluation {evaluation_id} not found")
            
            return evaluation
            
        except APIException as api_error:
            raise api_error
        except Exception as err:
            handle_db_error(err, "get_evaluation_by_id", error_type="query")
    
    def get_evaluations_by_user(
        self,
        user_id: UUID,
        session: Session,
        limit: int = 50,
        offset: int = 0
    ) -> Tuple[List[SelfEvaluation], int]:
        """Get all self-evaluations for a user."""
        try:
            count_statement = select(func.count(SelfEvaluation.evaluation_id)).where(
                SelfEvaluation.user_id == user_id
            )
            total = session.scalar(count_statement) or 0
            
            statement = select(SelfEvaluation).where(
                SelfEvaluation.user_id == user_id
            )
            statement = statement.order_by(SelfEvaluation.created_at.desc())
            statement = statement.limit(limit).offset(offset)
            
            evaluations = list(session.exec(statement))
            
            return evaluations, total
            
        except Exception as err:
            handle_db_error(err, "get_evaluations_by_user", error_type="query")
    
    def get_evaluations_by_task(
        self,
        task_id: UUID,
        session: Session,
        limit: int = 50,
        offset: int = 0
    ) -> Tuple[List[SelfEvaluation], int]:
        """Get all self-evaluations for a task."""
        try:
            base_statement = select(SelfEvaluation).where(
                SelfEvaluation.task_id == task_id
            )
            
            count_statement = select(func.count(SelfEvaluation.evaluation_id)).where(
                SelfEvaluation.task_id == task_id
            )
            total = session.scalar(count_statement) or 0
            
            statement = base_statement.order_by(SelfEvaluation.created_at.desc())
            statement = statement.limit(limit).offset(offset)
            
            evaluations = list(session.exec(statement))
            
            return evaluations, total
            
        except Exception as err:
            handle_db_error(err, "get_evaluations_by_task", error_type="query")

