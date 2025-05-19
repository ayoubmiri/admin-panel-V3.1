from pydantic import BaseModel
from typing import Optional
from datetime import datetime, time

class ScheduleBase(BaseModel):
    course_id: str
    day_of_week: str
    start_time: time
    end_time: time

class ScheduleCreate(ScheduleBase):
    room: Optional[str] = None
    teacher_id: Optional[str] = None

class ScheduleUpdate(BaseModel):
    course_id: Optional[str] = None
    day_of_week: Optional[str] = None
    start_time: Optional[time] = None
    end_time: Optional[time] = None
    room: Optional[str] = None
    teacher_id: Optional[str] = None

class ScheduleOut(ScheduleBase):
    id: str
    created_at: datetime
    updated_at: datetime
    room: Optional[str] = None
    teacher_id: Optional[str] = None

    class Config:
        orm_mode = True