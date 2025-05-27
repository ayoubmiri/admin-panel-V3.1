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
    first_name: Optional[str]
    last_name: Optional[str]
    email: Optional[EmailStr]
    phone: Optional[str]
    specialization: Optional[str]
    status: Optional[str]

class TeacherInDB(TeacherBase):
    id: UUID
