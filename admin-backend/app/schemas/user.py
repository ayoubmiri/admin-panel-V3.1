from datetime import datetime
from typing import Optional
from uuid import UUID
from pydantic import BaseModel, EmailStr, Field

class UserBase(BaseModel):
    username: str = Field(..., example="admin")
    email: EmailStr = Field(..., example="admin@estsale.ma")
    full_name: str = Field(..., example="Admin User")
    disabled: bool = Field(False, example=False)

class UserCreate(UserBase):
    password: str = Field(..., example="admin123")

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    disabled: Optional[bool] = None
    password: Optional[str] = None

class UserInDB(UserBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True