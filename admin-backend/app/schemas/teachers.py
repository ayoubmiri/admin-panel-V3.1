from pydantic import BaseModel, EmailStr
from typing import Optional
from uuid import UUID

class TeacherBase(BaseModel):
    teacher_id: str
    first_name: str
    last_name: str
    email: EmailStr
    phone: Optional[str] = None
    specialization: Optional[str] = None
    status: Optional[str] = 'active'

class TeacherCreate(TeacherBase):
    pass

class TeacherUpdate(BaseModel):
    teacher_id: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    specialization: Optional[str] = None
    status: Optional[str] = None

class TeacherInDB(TeacherBase):
    id: UUID
    # class Config:
    #     from_attributes = True
