from cassandra.cqlengine.query import DoesNotExist
from cassandra.cqlengine.management import sync_table
from typing import List, Optional
from uuid import UUID, uuid4
from app.database.models import Module
from app.schemas.modules import ModuleCreate, ModuleUpdate, ModuleInDB
from fastapi import HTTPException

# sync_table(Module)  # Uncomment if you need to sync

def get_module(module_id: UUID) -> Optional[ModuleInDB]:
    try:
        module = Module.objects(id=module_id).first()
        return ModuleInDB(**module._asdict()) if module else None
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching module: {e}")

def get_modules(skip: int = 0, limit: int = 100) -> List[ModuleInDB]:
    try:
        modules = Module.objects.all()[skip:skip + limit]
        return [ModuleInDB(**m._asdict()) for m in modules]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching modules: {e}")

def create_module(module: ModuleCreate) -> ModuleInDB:
    try:
        data = module.dict()
        data['id'] = uuid4()
        new_module = Module.create(**data)
        return ModuleInDB(**new_module._asdict())
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating module: {e}")

def update_module(module_id: UUID, update: ModuleUpdate) -> Optional[ModuleInDB]:
    try:
        existing = Module.objects(id=module_id).first()
        if not existing:
            return None
        for key, value in update.dict(exclude_unset=True).items():
            setattr(existing, key, value)
        existing.save()
        return ModuleInDB(**existing._asdict())
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating module: {e}")

def delete_module(module_id: UUID) -> bool:
    try:
        module = Module.objects(id=module_id).first()
        if not module:
            return False
        module.delete()
        return True
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting module: {e}")
    


 
