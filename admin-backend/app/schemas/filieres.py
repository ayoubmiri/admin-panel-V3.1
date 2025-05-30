from pydantic import BaseModel
from uuid import UUID
from typing import Optional
from datetime import date

class FiliereBase(BaseModel):
    code: str
    name: str
    description: Optional[str] = None
    duration: Optional[str] = None
    status: Optional[str] = 'active'
    version: Optional[int] = 1
    valid_from: Optional[date] = None
    valid_to: Optional[date] = None

class FiliereCreate(FiliereBase):
    pass

class FiliereUpdate(BaseModel):
    name: Optional[str]
    description: Optional[str]
    duration: Optional[str]
    status: Optional[str]
    version: Optional[int]
    valid_from: Optional[date]
    valid_to: Optional[date]

class FiliereInDB(FiliereBase):
    id: UUID

    class Config:
        orm_mode = True