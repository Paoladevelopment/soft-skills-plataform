from typing import List, Sequence, Tuple, Type

from sqlalchemy import asc, desc
from sqlalchemy.engine import ScalarResult
from sqlalchemy.sql import Select
from sqlmodel import Session, func, select
from utils.errors import handle_db_error


class QueryService:
    def _apply_ordering(self, statement: Select, entity: Type, order_by: List[str] = None, default_order_field: str = None):
        """
        Applies ordering criteria dynamically based on the provided order_by fields.
        - If `order_by` is provided, it sorts based on that.
        - If `order_by` is NOT provided but `default_order_field` is, it uses the default field (if it exists).
        - If neither is provided, it returns the original statement.
        """
        ordering_criteria = []
        
        if not order_by and hasattr(entity, default_order_field):
            return statement.order_by(getattr(entity, default_order_field))
        
        for field in order_by:
            if hasattr(entity, field):
                if field in ["priority", "created_at"]:
                    ordering_criteria.append(desc(getattr(entity, field)))
                else:
                    ordering_criteria.append(asc(getattr(entity, field)))
            
        return statement.order_by(*ordering_criteria) if ordering_criteria else statement

    def _get_paginated_entities(
        self,
        entity: Type,
        filter_field: str,
        filter_value: str,
        offset: int,
        limit: int,
        status: str = None,
        priority: str = None,
        order_by: List[str] = None,
        default_order_field: str = None,
        session: Session = None,
    ) -> Tuple[Sequence, int]:
        """
        Generic function to retrieve paginated and filtered entities.
        """
        try:
            statement = select(entity).where(getattr(entity, filter_field) == filter_value)
            count_statement = select(func.count()).where(getattr(entity, filter_field) == filter_value)

            if status and hasattr(entity, "status"):
                statement = statement.where(getattr(entity, "status") == status)
                count_statement = count_statement.where(getattr(entity, "status") == status)

            if priority and hasattr(entity, "priority"):
                statement = statement.where(getattr(entity, "priority") == priority)
                count_statement = count_statement.where(getattr(entity, "priority") == priority)

            statement = self._apply_ordering(statement, entity, order_by, default_order_field)
            total_count = session.scalar(count_statement)

            result: ScalarResult = session.exec(statement.offset(offset).limit(limit))
            entities = result.all()

            return entities, total_count
        
        except Exception as err:
            handle_db_error(err, "_get_paginated_entities", error_type="query")
