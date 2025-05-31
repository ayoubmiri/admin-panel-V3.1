from pydantic import BaseModel
from typing import Optional
from uuid import UUID
from datetime import date

class ModuleBase(BaseModel):
    filiere_id: UUID
    code: str
    name: str
    description: Optional[str] = None
    status: Optional[str] = 'active'
    version: Optional[int] = 1
    semester: Optional[str] = None
    valid_from: Optional[date] = None
    valid_to: Optional[date] = None

class ModuleCreate(ModuleBase):
    pass

class ModuleUpdate(BaseModel):
    filiere_id: Optional[UUID] 
    name: Optional[str]
    description: Optional[str]  = None
    version: Optional[int] = None
    semester: Optional[str]
    valid_from: Optional[date] = None
    valid_to: Optional[date] = None
    status: Optional[str]

class ModuleInDB(ModuleBase):
    id: UUID
