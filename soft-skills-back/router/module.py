from fastapi import APIRouter, Depends, Query, status
from sqlmodel import Session

from schema.module import (ModuleCreate, ModulePaginatedResponse, ModuleRead,
                           ModuleResponse, ModuleUpdate)
from service.auth_service import get_current_admin_user
from service.module import ModuleService
from utils.db import get_session
from utils.errors import APIException, raise_http_exception

router = APIRouter()

module_service = ModuleService()

@router.post(
    "",
    response_model=ModuleResponse,
    summary="Create a module",
    status_code=status.HTTP_201_CREATED,
)
def create_module(
    module: ModuleCreate, 
    current_user = Depends(get_current_admin_user),
    session: Session = Depends(get_session)
    ):
    try:
        created_module =  module_service.create_module(module, session)
        module_data = ModuleRead.model_validate(created_module)

        return ModuleResponse(
            message="Module created successfully",
            data=module_data
        )
    
    except APIException as exc:
        raise_http_exception(exc) 


@router.get("", summary="Retrieve all modules", response_model=ModulePaginatedResponse)
def get_all_modules(
        offset: int = Query(0, ge=0, description="Number of items to skip"),
        limit: int = Query(10, le=100, description="Maximum number of items to retrieve (max 100)"),
        session: Session = Depends(get_session),
    ):

    try:
        modules, total_count = module_service.get_all_modules(offset, limit, session)
        return ModulePaginatedResponse(
            message="Modules retrieved successfully",
            data=modules,
            total=total_count,
            offset=offset,
            limit=limit
        )
    
    except APIException as exc:
        raise_http_exception(exc)


@router.get("/{id}", summary="Retrieve a module by ID", response_model=ModuleResponse)
def get_module(id: int, session: Session = Depends(get_session)):
    try:
        module = module_service.get_module(id, session)
        module_data = ModuleRead.model_validate(module)

        return ModuleResponse(
            message="Modules retrieved successfully",
            data=module_data
        )
    
    except APIException as exc:
        raise_http_exception(exc)

@router.patch(
    "/{id}", summary="Update module details by ID", response_model=ModuleResponse
)
def update_module(
    id: int, 
    module: ModuleUpdate, 
    _ = Depends(get_current_admin_user),
    session: Session = Depends(get_session)
    ):
    try:
        updated_module = module_service.update_module(id, module, session)
        module_data = ModuleRead.model_validate(updated_module)

        return ModuleResponse(
            message="Module updated successfully",
            data=module_data
        )

    except APIException as exc:
        raise_http_exception(exc)


@router.delete("/{id}", summary="Delete a module by ID")
def delete_module(
    id: int, 
    _ = Depends(get_current_admin_user),
    session: Session = Depends(get_session)
    ):
    try:
        return module_service.delete_module(id, session)
    
    except APIException as exc:
        raise_http_exception(exc)
