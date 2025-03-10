from typing import Sequence

from fastapi import Depends
from sqlmodel import Session, func, select

from model.module import Module
from schema.module import ModuleCreate, ModuleUpdate
from utils.db import get_session
from utils.errors import APIException, Duplicate, Missing, handle_db_error


class ModuleService:
    def create_module(self, module: ModuleCreate, session: Session) -> Module:
        try:
            existing_module = session.exec(select(Module).where(Module.title == module.title)).first()
            if existing_module:
                raise Duplicate(f"Module with title '{module.title}' already exists.")
        
        except APIException:
            raise
        
        except Exception as exc:
            handle_db_error(exc, "create_module", error_type="query")

        try:
            module_dict = module.model_dump()
            new_module = Module(**module_dict)

            session.add(new_module)
            session.commit()
            session.refresh(new_module)
            return new_module
        
        except Exception as exc:
            session.rollback()
            handle_db_error(exc, "create_module", error_type="commit")
        

    def get_all_modules(
            self,
            offset: int,
            limit: int, 
            session: Session = Depends(get_session),
        ) -> tuple[Sequence[Module], int]:

        try:
            total_count = session.scalar(select(func.count(Module.id)))
            modules = session.exec(select(Module).offset(offset).limit(limit)).all()

            return modules, total_count
        
        except Exception as exc:
            handle_db_error(exc, "read_modules", error_type="query")

    def get_module(self, id: int, session: Session) -> Module:
        try:
            module = session.get(Module, id)

            if not module:
                raise Missing("Module not found")
            return module
        
        except APIException:
            raise

        except Exception as exc:
            handle_db_error(exc, "read_module", error_type="query")

    def update_module(self, id: int, module: ModuleUpdate, session: Session):
        try:
            module_to_update = self.get_module(id, session)

            if module.title and module.title != module_to_update.title:
                statement = select(Module).where(
                    Module.title == module.title,
                    Module.id != id
                )

                module_with_new_name = session.exec(statement).first()

                if module_with_new_name:
                    raise Duplicate(f"Module title '{module_with_new_name.title}' is already in use.")
        
        except APIException:
            raise
                
        except Exception as exc:
            handle_db_error(exc, "update_module", error_type="query") 

        try:
            module_data = module.model_dump(exclude_unset=True)
            for key, value in module_data.items():
                setattr(module_to_update, key, value)

            session.commit()
            session.refresh(module_to_update)

            return module_to_update
        
        except Exception as exc:
            session.rollback()
            handle_db_error(exc, "update_module", error_type="commit")


    def delete_module(self, id: int, session: Session):
        try:
            module = self.get_module(id, session)

        except APIException:
            raise
            
        except Exception as exc:
            handle_db_error(exc, "delete_module", error_type="query")

        try:
            session.delete(module)
            session.commit()

            return {"message": "Module deleted successfully", "id": id}
        
        except Exception as exc:
            session.rollback()
            handle_db_error(exc, "delete_module", error_type="commit")