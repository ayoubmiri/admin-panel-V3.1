from pydantic import BaseModel
from typing import Optional
from uuid import UUID
from datetime import date

class ModuleBase(BaseModel):
    filiere_id: UUID
    code: str
    name: str
    description: Optional[str] = None
    version: Optional[int] = 1
    valid_from: Optional[date]
    valid_to: Optional[date]
    status: Optional[str] = 'active'

class ModuleCreate(ModuleBase):
    pass

class ModuleUpdate(BaseModel):
    code: Optional[str]
    name: Optional[str]
    description: Optional[str]
    version: Optional[int]
    valid_from: Optional[date]
    valid_to: Optional[date]
    status: Optional[str]

class ModuleInDB(ModuleBase):
    id: UUID
