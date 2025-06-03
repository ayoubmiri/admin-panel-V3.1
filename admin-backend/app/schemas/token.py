from pydantic import BaseModel
from typing import List


class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: str
    user_id: str
    email: str
    roles: List[str]


# from pydantic import BaseModel
# from typing import List

# class TokenData(BaseModel):
#     user_id: str
#     email: str
#     roles: List[str]