from typing import Union
from uuid import UUID

from sqlmodel import Session, or_, select

from model.user import User
from schema.user import UserCreate, UserUpdate
from utils.errors import APIException, Duplicate, Missing, handle_db_error
from utils.security import get_password_hash


class UserService:
    def check_duplicate_user(self, session: Session, username: str, email: str, exclude_user_id: UUID = None):
        try:
            query = select(User).where(
                or_(User.username == username, User.email == email)
            )

            if exclude_user_id:
                query = query.where(User.user_id != exclude_user_id)

            existing_user = session.exec(query).first()

            if existing_user:
                if existing_user.username == username:
                    raise Duplicate("This username is already taken. Please choose another one.")
                if existing_user.email == email:
                    raise Duplicate("An account with this email already exists. Please use a different email.")
        
        except APIException:
            raise

        except Exception as exc:
            handle_db_error(exc, "check_duplicate_user", error_type="query")

    def create_user(self, user: UserCreate, session: Session) -> User:
        try:
            self.check_duplicate_user(session, user.username, user.email)
        
        except APIException:
            raise
        
        try:
            user_dict = user.model_dump()
            new_user = User(**user_dict)
            new_user.password = get_password_hash(user.password)

            session.add(new_user)
            session.commit()

            return new_user

        except Exception as exc:
            session.rollback()
            handle_db_error(exc, "create_user", error_type="commit")
    
    def get_user(self, identifier: Union[UUID, str], session: Session) -> User:
        try:
            if isinstance(identifier, UUID):
                query = select(User).where(User.user_id == identifier)
            else:
                query = select(User).where(User.email == identifier)
            
            user = session.exec(query).first()

            if not user:
                raise Missing("Objective not found")
            return user
        
        except APIException:
            raise

        except Exception as exc:
            handle_db_error(exc, "get_user", error_type="query")

    def update_user(self, user_id: UUID, user: UserUpdate, session: Session) -> User:
        try:
            existing_user = self.get_user(user_id, session)
            self.check_duplicate_user(session, user.username, user.email, user_id)
        
        except APIException:
            raise
        
        try:
            user_data = user.model_dump(exclude_unset=True)
            for key, value in user_data.items():
                setattr(existing_user, key, value)

            session.commit()

            return existing_user
        
        except Exception as exc:
            session.rollback()
            handle_db_error(exc, "update_user", error_type="commit")

    def deactivate_user(self, user_id: UUID, session: Session):
        try:    
            existing_user = self.get_user(user_id, session)

            if existing_user.disabled:
                return {"message": "User is already deactivated"}
            
            existing_user.disabled = True
            session.commit()

            return {"message": "User deactivated successfully"}
        
        except Exception as exc:
            session.rollback()
            handle_db_error(exc, "deactivate_user", error_type="commit")
