"""
Service layer for SelfEvaluation operations.
"""
from uuid import UUID
from typing import List, Optional, Tuple
from sqlmodel import Session, select, func
from sqlalchemy import desc, asc, Select

from model.self_evaluation import SelfEvaluation
from model.task import Task
from schema.self_evaluation import SelfEvaluationCreate, SelfEvaluationRead, SelfEvaluationListItem
from enums.study_context import PerceivedDifficulty, Mood
from utils.errors import APIException, Missing, handle_db_error


class SelfEvaluationService:
    """Service for managing self-evaluations."""
    
    def _build_list_query(self, user_id: UUID) -> Select:
        """Build the base query for listing self-evaluations with task join."""
        return select(
            SelfEvaluation.evaluation_id,
            SelfEvaluation.task_id,
            Task.title.label("task_title"),
            SelfEvaluation.created_at,
            SelfEvaluation.perceived_difficulty
        ).join(
            Task, SelfEvaluation.task_id == Task.task_id
        ).where(
            SelfEvaluation.user_id == user_id
        )
    
    def _build_count_query(self, user_id: UUID) -> Select:
        """Build the count query for self-evaluations."""
        return select(func.count(SelfEvaluation.evaluation_id)).where(
            SelfEvaluation.user_id == user_id
        )
    
    def _apply_filters(
        self,
        base_statement: Select,
        count_statement: Select,
        difficulty: Optional[PerceivedDifficulty],
        mood: Optional[Mood]
    ) -> Tuple[Select, Select]:
        """Apply difficulty and mood filters to both statements."""
        if difficulty:
            base_statement = base_statement.where(
                SelfEvaluation.perceived_difficulty == difficulty
            )
            count_statement = count_statement.where(
                SelfEvaluation.perceived_difficulty == difficulty
            )
        
        if mood:
            base_statement = base_statement.where(
                SelfEvaluation.mood == mood
            )
            count_statement = count_statement.where(
                SelfEvaluation.mood == mood
            )
        
        return base_statement, count_statement
    
    def _apply_sorting(self, statement: Select, sort_by: Optional[str]) -> Select:
        """Apply sorting to the query statement."""
        if sort_by == "date_asc":
            return statement.order_by(asc(SelfEvaluation.created_at))
        elif sort_by == "date_desc":
            return statement.order_by(desc(SelfEvaluation.created_at))
        else:
            return statement.order_by(desc(SelfEvaluation.created_at))
    
    def _convert_to_list_items(self, results: List) -> List[SelfEvaluationListItem]:
        """Convert query results to SelfEvaluationListItem objects."""
        return [
            SelfEvaluationListItem(
                evaluation_id=row.evaluation_id,
                task_id=row.task_id,
                task_title=row.task_title,
                created_at=row.created_at,
                perceived_difficulty=row.perceived_difficulty
            )
            
            for row in results
        ]
    
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
    ) -> SelfEvaluationRead:
        """Get a self-evaluation by ID with task title."""
        try:
            statement = select(
                SelfEvaluation,
                Task.title.label("task_title")
            ).join(
                Task, SelfEvaluation.task_id == Task.task_id
            ).where(
                SelfEvaluation.evaluation_id == evaluation_id
            )
            
            result = session.exec(statement).first()
            
            if not result:
                raise Missing(f"Autoevaluación {evaluation_id} no encontrada")
            
            evaluation, task_title = result
            
            evaluation_dict = evaluation.model_dump()
            evaluation_dict["task_title"] = task_title
            
            return SelfEvaluationRead.model_validate(evaluation_dict)
            
        except APIException as api_error:
            raise api_error
        except Exception as err:
            handle_db_error(err, "get_evaluation_by_id", error_type="query")
    
    def get_evaluations_by_user(
        self,
        user_id: UUID,
        session: Session,
        limit: int = 50,
        offset: int = 0,
        difficulty: Optional[PerceivedDifficulty] = None,
        mood: Optional[Mood] = None,
        sort_by: Optional[str] = None
    ) -> Tuple[List[SelfEvaluationListItem], int]:
        """Get all self-evaluations for a user with optional filtering and sorting."""
        try:
            base_statement = self._build_list_query(user_id)
            count_statement = self._build_count_query(user_id)
            
            base_statement, count_statement = self._apply_filters(
                base_statement,
                count_statement,
                difficulty,
                mood
            )
            
            total = session.scalar(count_statement) or 0
            
            statement = self._apply_sorting(base_statement, sort_by)
            statement = statement.limit(limit).offset(offset)
            
            results = session.exec(statement).all()
            evaluations = self._convert_to_list_items(results)
            
            return evaluations, total
            
        except Exception as err:
            handle_db_error(err, "get_evaluations_by_user", error_type="query")

