from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class TeacherBase(BaseModel):
    teacher_id: str
    first_name: str
    last_name: str
    email: EmailStr

class TeacherCreate(TeacherBase):
    phone: Optional[str] = None
    specialization: Optional[str] = None

class TeacherUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    specialization: Optional[str] = None
    status: Optional[str] = None

class TeacherOut(TeacherBase):
    id: str
    created_at: datetime
    updated_at: datetime
    phone: Optional[str] = None
    specialization: Optional[str] = None
    status: Optional[str] = None

    class Config:
        orm_mode = True