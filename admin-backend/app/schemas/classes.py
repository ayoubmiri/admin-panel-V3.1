from pydantic import BaseModel, UUID4
from typing import Optional

class ClassCreateSchema(BaseModel):
    filiere_id: UUID4
    code: str
    name: str
    academic_year: Optional[str]
    semester: Optional[str]

class ClassUpdateSchema(BaseModel):
    code: Optional[str]
    name: Optional[str]
    academic_year: Optional[str]
    semester: Optional[str]

class ClassSchema(BaseModel):
    filiere_id: UUID4
    code: str
    name: str
    academic_year: Optional[str]
    semester: Optional[str]

    class Config:
        orm_mode = True
