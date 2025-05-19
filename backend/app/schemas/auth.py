from pydantic import BaseModel
from typing import List
class Login(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str

class TokenData(BaseModel):
    username: str = None
    roles: List[str] = []