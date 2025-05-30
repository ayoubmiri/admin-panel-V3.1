from pydantic import BaseModel
from uuid import UUID


from typing import Optional

class ClassCreateSchema(BaseModel):
    filiere_id: UUID
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
    filiere_id: UUID
    code: str
    name: str
    academic_year: Optional[str]
    semester: Optional[str]

    # class Config:
    #     orm_mode = True
