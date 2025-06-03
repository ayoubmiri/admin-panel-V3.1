from pydantic import BaseModel, UUID4
from datetime import datetime
from typing import Optional
from uuid import UUID

class ScoreDetailSchema(BaseModel):
    assignment: float
    quiz: float
    midterm: float
    project: float

class GradeCreateSchema(BaseModel):
    student_id: UUID4
    control_id: UUID4
    final_exam_id: UUID4
    scores: ScoreDetailSchema
    status: str

class GradeUpdateSchema(BaseModel):
    scores: Optional[ScoreDetailSchema] = None
    status: Optional[str] = None

class GradeSchema(BaseModel):
    id: UUID4
    student_id: UUID4
    control_id: UUID4
    final_exam_id: UUID4
    scores: ScoreDetailSchema
    status: str
    created_at: datetime
    updated_at: datetime

    # class Config:
    #     orm_mode = True
