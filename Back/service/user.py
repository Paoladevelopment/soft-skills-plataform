from fastapi import Depends
from sqlmodel import Session, select, or_
from utils.db import get_session
from utils.errors import Duplicate, handle_db_error
from schema.user import UserCreate, UserUpdate
from model.user import User
from service.auth_service import get_password_hash

def validate_email_or_username_uniqueness(existing_user: User, new_username: str, new_email: str):
    if existing_user:
            if existing_user.username == new_username:
                raise Duplicate("This username is already taken. Please choose another one.")

            if existing_user.email == new_email:
                raise Duplicate("An account with this email already exists. Please use a different email.")

def create_user(user: UserCreate, db: Session = Depends(get_session)) -> User:
    try:
        statement = select(User).where(
            or_(User.username == user.username, User.email == user.email)
        )
        existing_user = db.exec(statement).first()

        validate_email_or_username_uniqueness(existing_user, user.name, user.email)
    
    except Duplicate:
        raise
    
    except Exception as exc:
        handle_db_error(exc, "create_user", error_type="query")
    
    try:
        user_to_db = User(
            name=user.name,
            username=user.username,
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
        handle_db_error(exc, "create_user", error_type="commit")

def update_user(current_user: User, user: UserUpdate, db: Session = Depends(get_session)) -> User:
    try:
        statement = select(User).where(
            or_(User.username == user.username, User.email == user.email),
            User.user_id != current_user.user_id
        )

        existing_user = db.exec(statement).first()

        validate_email_or_username_uniqueness(existing_user, user.username, user.email)
    
    except Duplicate:
        raise
    
    except Exception as exc:
        handle_db_error(exc, "update_user", error_type="query")
    
    try:
        user_data = user.model_dump(exclude_unset=True)
        for key, value in user_data.items():
            setattr(current_user, key, value)

        db.add(current_user)
        db.commit()
        db.refresh(current_user)

        return current_user
    
    except Exception as exc:
        db.rollback()
        handle_db_error(exc, "update_user", error_type="commit")

def deactivate_user(current_user: User, db: Session = Depends(get_session)):
    if current_user.disabled:
        return {"message": "User is already deactivated"}

    try:    
        current_user.disabled = True
        db.add(current_user)
        db.commit()
        db.refresh(current_user)

        return {"message": "User deactivated successfully"}
    
    except Exception as exc:
        db.rollback()
        handle_db_error(exc, "deactivate_user", error_type="commit")
