from pydantic import BaseModel
from typing import Optional

class UserCreate(BaseModel):
    username: str
    email: str
    full_name: str
    disabled: bool = False
    hashed_password: Optional[str] = None