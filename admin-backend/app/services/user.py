from typing import List, Optional
from uuid import UUID
from app.crud.user import (
    create_user as crud_create_user,
    get_user as crud_get_user,
    get_users as crud_get_users,
    update_user as crud_update_user,
    delete_user as crud_delete_user
)
from app.schemas.user import UserCreate, UserUpdate, UserInDB
from app.database.cassandra import get_session
from app.core.security import get_password_hash

def get_users(skip: int = 0, limit: int = 100) -> List[UserInDB]:
    session = get_session()
    return crud_get_users(session, skip=skip, limit=limit)

def get_user(user_id: UUID) -> Optional[UserInDB]:
    session = get_session()
    return crud_get_user(session, user_id)

def create_user(user: UserCreate) -> UserInDB:
    session = get_session()
    hashed_password = get_password_hash(user.password)
    return crud_create_user(session, user, hashed_password)

def update_user(user_id: UUID, user: UserUpdate) -> Optional[UserInDB]:
    session = get_session()
    hashed_password = get_password_hash(user.password) if user.password else None
    return crud_update_user(session, user_id, user, hashed_password)

def delete_user(user_id: UUID) -> bool:
    session = get_session()
    return crud_delete_user(session, user_id)