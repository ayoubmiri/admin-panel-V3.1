from pydantic import BaseModel
from typing import Optional
from uuid import UUID


class ElementBase(BaseModel):
    module_id: UUID
    code: str
    name: str
    description: Optional[str] = None
    semester: Optional[str] = None
    status: Optional[str] = 'active'
    version: Optional[int] = 1


class ElementCreateSchema(ElementBase):
    pass

class ElementUpdateSchema(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    semester: Optional[str] = None

class ElementSchema(BaseModel):
    module_id: UUID
    code: str
    name: str
    description: Optional[str] = None

