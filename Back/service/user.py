from sqlmodel import Session, select, or_
from utils.errors import Duplicate, APIException, handle_db_error
from schema.user import UserCreate, UserUpdate
from model.user import User
from service.auth_service import get_password_hash

class UserService:
    def check_duplicate_user(self, session: Session, username: str, email: str, exclude_user_id: str = None):
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
            session.refresh(new_user)

            return new_user

        except Exception as exc:
            session.rollback()
            handle_db_error(exc, "create_user", error_type="commit")

    def update_user(self, current_user: User, user: UserUpdate, session: Session) -> User:
        try:
            self.check_duplicate_user(session, user.username, user.email, current_user.user_id)
        
        except APIException:
            raise
        
        try:
            user_data = user.model_dump(exclude_unset=True)
            for key, value in user_data.items():
                setattr(current_user, key, value)

            session.commit()
            session.refresh(current_user)

            return current_user
        
        except Exception as exc:
            session.rollback()
            handle_db_error(exc, "update_user", error_type="commit")

    def deactivate_user(self, current_user: User, session: Session):
        if current_user.disabled:
            return {"message": "User is already deactivated"}

        try:    
            current_user.disabled = True
            session.commit()
            session.refresh(current_user)

            return {"message": "User deactivated successfully"}
        
        except Exception as exc:
            session.rollback()
            handle_db_error(exc, "deactivate_user", error_type="commit")
