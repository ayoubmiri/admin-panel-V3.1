from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class StudentBase(BaseModel):
    student_id: str
    first_name: str
    last_name: str
    email: EmailStr

class StudentCreate(StudentBase):
    phone: Optional[str] = None
    program: Optional[str] = None
    year: Optional[str] = None

class StudentUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    program: Optional[str] = None
    year: Optional[str] = None
    status: Optional[str] = None

class StudentOut(StudentBase):
    id: str
    created_at: datetime
    updated_at: datetime
    phone: Optional[str] = None
    program: Optional[str] = None
    year: Optional[str] = None
    status: Optional[str] = None

    class Config:
        orm_mode = True