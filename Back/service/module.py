from typing import Sequence
from fastapi import Depends
from sqlmodel import Session, select, func
from utils.db import get_session
from utils.errors import Duplicate, Missing, handle_db_error
from model.module import Module
from schema.module import ModuleCreate, ModuleUpdate

def create_module_in_db(module: ModuleCreate, db: Session = Depends(get_session)) -> Module:
    try:
        existing_module = db.exec(select(Module).where(Module.title == module.title)).first()
        if existing_module:
            raise Duplicate(f"Module with title '{module.title}' already exists.")
    
    except Duplicate:
        raise
    
    except Exception as exc:
        handle_db_error(exc, "create_module", error_type="query")

    try:
        module_to_db = Module(
            title=module.title,
            category=module.category,
            description=module.description,
            status=module.status,
            objective=module.objective,
            tags=module.tags,
            image_url=module.image_url
        )

        db.add(module_to_db)
        db.commit()
        db.refresh(module_to_db)
        return module_to_db
    
    except Exception as exc:
        db.rollback()
        handle_db_error(exc, "create_module", error_type="commit")
    

def read_modules(
        offset: int,
        limit: int, 
        db: Session = Depends(get_session),
    ) -> tuple[Sequence[Module], int]:

    try:
        total_count = db.scalar(select(func.count(Module.id)))
        modules = db.exec(select(Module).offset(offset).limit(limit)).all()

        return modules, total_count
    
    except Exception as exc:
        handle_db_error(exc, "read_modules", error_type="query")

def read_module(id: int, db: Session = Depends(get_session)) -> Module:
    try:
        module = db.get(Module, id)

        if not module:
            raise Missing("Module not found")
        return module
    
    except Missing:
        raise

    except Exception as exc:
        handle_db_error(exc, "read_module", error_type="query")

def update_module_in_db(id: int, module: ModuleUpdate, db: Session = Depends(get_session)):
    try:
        module_to_update = db.get(Module, id)

        if not module_to_update:
            raise Missing("Module is not registered.")

        if module.title and module.title != module_to_update.title:
            statement = select(Module).where(
                Module.title == module.title,
                Module.id != id
            )

            module_with_new_name = db.exec(statement).first()

            if module_with_new_name:
                raise Duplicate(f"Module title '{module_with_new_name.title}' is already in use.")
    
    except Missing:
        raise

    except Duplicate:
        raise
            
    except Exception as exc:
        handle_db_error(exc, "update_module", error_type="query") 

    try:
        module_data = module.model_dump(exclude_unset=True)
        for key, value in module_data.items():
            setattr(module_to_update, key, value)

        db.add(module_to_update)
        db.commit()
        db.refresh(module_to_update)

        return module_to_update
    
    except Exception as exc:
        db.rollback()
        handle_db_error(exc, "update_module", error_type="commit")


def delete_module_in_db(id: int, db: Session = Depends(get_session)):
    try:
        module = db.get(Module, id)

        if not module:
            raise Missing("Module is not registered.")
        
    except Missing:
        raise
        
    except Exception as exc:
        handle_db_error(exc, "delete_module", error_type="query")

    try:
        db.delete(module)
        db.commit()

        return {"message": "Module deleted successfully", "id": id}
    
    except Exception as exc:
        db.rollback()
        handle_db_error(exc, "delete_module", error_type="commit")