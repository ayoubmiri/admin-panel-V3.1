from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class CourseBase(BaseModel):
    code: str
    name: str
    program: str

class CourseCreate(CourseBase):
    description: Optional[str] = None
    credits: Optional[int] = None

class CourseUpdate(BaseModel):
    code: Optional[str] = None
    name: Optional[str] = None
    description: Optional[str] = None
    credits: Optional[int] = None
    program: Optional[str] = None

class CourseOut(CourseBase):
    id: str
    created_at: datetime
    updated_at: datetime
    description: Optional[str] = None
    credits: Optional[int] = None

    class Config:
        orm_mode = True