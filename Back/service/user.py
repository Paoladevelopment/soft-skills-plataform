from fastapi import Depends
from sqlmodel import Session, select, or_

from utils.db import get_session
from utils.errors import Duplicate, InternalError
from schema.user_schema import UserCreate, UserUpdate
from model.user import User
from auth_service import get_password_hash

def create_user(user: UserCreate, db: Session = Depends(get_session)) -> User:
    try:
        statement = select(User).where(User.email == user.email)
        user_in_db = db.exec(statement).first()

        if user_in_db:
            raise Duplicate("Email already registered")
        
        user_to_db = User(
            name=user.name,
            email=user.email,
            password=get_password_hash(user.password),
            profile_picture=user.profile_picture,
        )

        db.add(user_to_db)
        db.commit()
        db.refresh(user_to_db)
        return user_to_db

    except Exception as exc:
        db.rollback()
        raise InternalError(f"An error occurred while creating the user: {str(exc)}")

def update_user(current_user: User, user: UserUpdate, db: Session = Depends(get_session)):
    try:
        statement = select(User).where(
            or_(User.username == user.username, User.email == user.email),
            User.user_id != current_user.user_id
        )

        existing_user = db.exec(statement).first()

        if existing_user:
            if existing_user.username == user.username:
                raise Duplicate("The username is already in use")
        
            if existing_user.email == user.email:
             raise Duplicate("The email is already in use.")

        user_data = user.model_dump(exclude_unset=True)
        for key, value in user_data.items():
            setattr(current_user, key, value)

        db.add(current_user)
        db.commit()
        db.refresh(current_user)

        return current_user
    
    except Exception as exc:
        db.rollback()
        raise InternalError(f"An error occurred while updating the user: {str(exc)}")

def deactivate_user(current_user: User, db: Session = Depends(get_session)):
    try:

        if not current_user.disabled:
            current_user.disabled = True
            
            db.commit()
            db.refresh(current_user)

            return {"message": "User deactivated successfully"}
    
    except Exception as exc:
        db.rollback()
        raise InternalError(f"An error occurred while deactivating the user: {str(exc)}")
