from typing import List, Optional
from uuid import UUID
from app.schemas.modules import ModuleCreate, ModuleUpdate, ModuleInDB
from app.crud.modules import (
    get_module,
    get_modules,
    create_module,
    update_module,
    delete_module,
)

def get_all_modules(skip: int = 0, limit: int = 100) -> List[ModuleInDB]:
    return get_modules(skip=skip, limit=limit)

def get_single_module(module_id: UUID) -> Optional[ModuleInDB]:
    return get_module(module_id)

def create_new_module(module: ModuleCreate) -> ModuleInDB:
    return create_module(module)

def update_existing_module(module_id: UUID, module: ModuleUpdate) -> Optional[ModuleInDB]:
    return update_module(module_id, module)

def delete_existing_module(module_id: UUID) -> bool:
    return delete_module(module_id)
