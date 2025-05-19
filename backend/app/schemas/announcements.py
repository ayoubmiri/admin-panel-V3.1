from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class AnnouncementBase(BaseModel):
    title: str
    content: str

class AnnouncementCreate(AnnouncementBase):
    is_important: bool = False
    tags: List[str] = []

class AnnouncementUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    is_important: Optional[bool] = None
    tags: Optional[List[str]] = None

class AnnouncementOut(AnnouncementBase):
    id: str
    author_id: str
    created_at: datetime
    updated_at: datetime
    is_important: bool
    tags: List[str]

    class Config:
        orm_mode = True