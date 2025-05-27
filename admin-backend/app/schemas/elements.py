from pydantic import BaseModel, UUID4
from typing import Optional

class ElementCreateSchema(BaseModel):
    module_id: UUID4
    code: str
    name: str
    description: Optional[str] = None

class ElementUpdateSchema(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None

class ElementSchema(BaseModel):
    module_id: UUID4
    code: str
    name: str
    description: Optional[str] = None

    class Config:
        orm_mode = True
