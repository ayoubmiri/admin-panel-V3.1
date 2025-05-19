from pydantic import BaseModel, condecimal
from typing import Optional
from datetime import datetime

class GradeBase(BaseModel):
    student_id: str
    course_id: str
    assignment: str
    score: condecimal(ge=0)
    max_score: condecimal(ge=0)

class GradeCreate(GradeBase):
    comments: Optional[str] = None

class GradeUpdate(BaseModel):
    score: Optional[condecimal(ge=0)] = None
    max_score: Optional[condecimal(ge=0)] = None
    comments: Optional[str] = None

class GradeOut(GradeBase):
    id: str
    created_at: datetime
    updated_at: datetime
    comments: Optional[str] = None

    class Config:
        orm_mode = True