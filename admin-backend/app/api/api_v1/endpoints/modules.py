from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas.modules import ModuleInDB, ModuleCreate, ModuleUpdate
from app.services.modules import (
    get_all_modules,
    get_single_module,
    create_new_module,
    update_existing_module,
    delete_existing_module,
)
from app.api.deps import get_current_user
from app.database.models import User

router = APIRouter()

@router.post("/", response_model=ModuleInDB, status_code=status.HTTP_201_CREATED)
async def create_module(
    module: ModuleCreate,
    current_user: User = Depends(get_current_user)
):
    return create_new_module(module)

@router.get("/", response_model=List[ModuleInDB])
async def read_modules(
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_user)
):
    return get_all_modules(skip, limit)

@router.get("/{module_id}", response_model=ModuleInDB)
async def read_module(
    module_id: UUID,
    current_user: User = Depends(get_current_user)
):
    module = get_single_module(module_id)
    if not module:
        raise HTTPException(status_code=404, detail="Module not found")
    return module

@router.put("/{module_id}", response_model=ModuleInDB)
async def update_module(
    module_id: UUID,
    module: ModuleUpdate,
    current_user: User = Depends(get_current_user)
):
    updated = update_existing_module(module_id, module)
    if not updated:
        raise HTTPException(status_code=404, detail="Module not found")
    return updated

@router.delete("/{module_id}", response_model=dict)
async def delete_module(
    module_id: UUID,
    current_user: User = Depends(get_current_user)
):
    success = delete_existing_module(module_id)
    if not success:
        raise HTTPException(status_code=404, detail="Module not found")
    return {"message": "Module deleted successfully"}
