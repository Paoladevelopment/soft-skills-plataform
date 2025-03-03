from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlmodel import Session
from utils.db import get_session
from utils.errors import Duplicate, Missing, InternalError, raise_http_exception
from schema.module import ModuleCreate, ModuleRead, ModuleUpdate, ModulePaginatedResponse, ModuleResponse
from service.module import (create_module_in_db, delete_module_in_db, read_module,
                            read_modules, update_module_in_db)
from service.auth_service import get_current_admin_user

router = APIRouter()

@router.post(
    "",
    response_model=ModuleResponse,
    summary="Create a module",
    status_code=status.HTTP_201_CREATED,
)
def create_module(
    module: ModuleCreate, 
    token_data = Depends(get_current_admin_user),
    db: Session = Depends(get_session)
    ):
    try:
        created_module =  create_module_in_db(module=module, db=db)
        module_data = ModuleRead.model_validate(created_module)

        return ModuleResponse(
            message="Module created successfully",
            data=module_data
        )
    
    except Duplicate as exc:
        raise_http_exception(exc)
    
    except InternalError as exc:
        raise_http_exception(exc)
    

@router.get("", summary="Retrieve all modules", response_model=ModulePaginatedResponse)
def get_all_modules(
        offset: int = Query(0, ge=0, description="Number of items to skip"),
        limit: int = Query(10, le=100, description="Maximum number of items to retrieve (max 100)"),
        db: Session = Depends(get_session),
    ):

    try:
        modules, total_count = read_modules(offset, limit, db)
        return ModulePaginatedResponse(
            message="Modules retrieved successfully",
            data=modules,
            total=total_count,
            offset=offset,
            limit=limit
        )
    
    except InternalError as exc:
        raise_http_exception(exc)


@router.get("/{id}", summary="Retrieve a module by ID", response_model=ModuleResponse)
def get_module(id: int, db: Session = Depends(get_session)):
    try:
        module = read_module(id, db)
        module_data = ModuleRead.model_validate(module)

        return ModuleResponse(
            message="Modules retrieved successfully",
            data=module_data
        )
    
    except Missing as exc:
        raise_http_exception(exc)
    
    except InternalError as exc:
        raise_http_exception(exc)


@router.patch(
    "/{id}", summary="Update module details by ID", response_model=ModuleResponse
)
def update_module(
    id: int, 
    module: ModuleUpdate, 
    token_data = Depends(get_current_admin_user),
    db: Session = Depends(get_session)
    ):
    try:
        updated_module = update_module_in_db(id, module, db)
        module_data = ModuleRead.model_validate(updated_module)

        return ModuleResponse(
            message="Module updated successfully",
            data=module_data
        )

    except Missing as exc:
        raise_http_exception(exc)

    except Duplicate as exc:
        raise_http_exception(exc)

    except InternalError as exc:
        raise_http_exception(exc)


@router.delete("/{id}", summary="elimina un modulo por ID")
def delete_module(
    id: int, 
    token_data = Depends(get_current_admin_user),
    db: Session = Depends(get_session)
    ):
    try:
        return delete_module_in_db(id, db)
    
    except Missing as exc:
        raise_http_exception(exc)

    except InternalError as exc:
        raise_http_exception(exc)
