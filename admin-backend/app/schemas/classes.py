from pydantic import BaseModel
from uuid import UUID
from typing import Optional

class ClassBase(BaseModel):
    filiere_id: UUID
    code: str
    name: str
    academic_year: Optional[str] = None
    semester: Optional[str] = None

class ClassCreateSchema(ClassBase):
    pass

class ClassUpdateSchema(ClassBase):
    filiere_id: Optional[UUID]
    name: Optional[str]
    academic_year: Optional[str]
    semester: Optional[str]

class ClassSchema(ClassBase):
    id: UUID

class ClassInDB(ClassBase):
    id: UUID

    # class Config:
    #     orm_mode = True





# from pydantic import BaseModel
# from uuid import UUID


# from typing import Optional

# class ClassBase(BaseModel):
#     filiere_id: UUID
#     code: str
#     name: str
#     academic_year: Optional[str] = None
#     semester: Optional[str] = None


# class ClassCreateSchema(ClassBase):
#     pass


# class ClassUpdateSchema(ClassBase):
#     filiere_id: Optional[UUID]
#     code: Optional[str]
#     name: Optional[str]
#     academic_year: Optional[str]
#     semester: Optional[str]

# class ClassSchema(BaseModel):
#     filiere_id: UUID
#     code: str
#     name: str
#     academic_year: Optional[str]
#     semester: Optional[str]

# class ClassInDB(ClassBase):
#     id: UUID

#     class Config:
#         orm_mode = True