import uuid
from datetime import datetime
from typing import List, Optional
from cassandra.cluster import Session
from app.schemas.user import UserCreate, UserInDB, UserUpdate

def create_user(session: Session, user: UserCreate, hashed_password: str) -> UserInDB:
    user_id = uuid.uuid4()
    created_at = datetime.utcnow().isoformat()
    updated_at = created_at
    
    query = """
    INSERT INTO users (
        id, username, email, full_name, 
        hashed_password, disabled, created_at, updated_at
    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
    """
    
    session.execute(query, (
        user_id,
        user.username,
        user.email,
        user.full_name,
        hashed_password,
        user.disabled,
        created_at,
        updated_at
    ))
    
    return UserInDB(
        id=user_id,
        username=user.username,
        email=user.email,
        full_name=user.full_name,
        disabled=user.disabled,
        created_at=created_at,
        updated_at=updated_at
    )

def get_user(session: Session, user_id: uuid.UUID) -> Optional[UserInDB]:
    query = "SELECT * FROM users WHERE id = %s"
    result = session.execute(query, [user_id])
    row = result.one()
    if row:
        return UserInDB(**row)
    return None

def get_users(session: Session, skip: int = 0, limit: int = 100) -> List[UserInDB]:
    query = "SELECT * FROM users LIMIT %s"
    result = session.execute(query, [limit])
    return [UserInDB(**row) for row in result]

def update_user(session: Session, user_id: uuid.UUID, user: UserUpdate, hashed_password: Optional[str] = None) -> Optional[UserInDB]:
    existing_user = get_user(session, user_id)
    if not existing_user:
        return None
    
    updated_at = datetime.utcnow().isoformat()
    
    fields = []
    values = []
    
    if user.email is not None:
        fields.append("email = %s")
        values.append(user.email)
    if user.full_name is not None:
        fields.append("full_name = %s")
        values.append(user.full_name)
    if user.disabled is not None:
        fields.append("disabled = %s")
        values.append(user.disabled)
    if hashed_password is not None:
        fields.append("hashed_password = %s")
        values.append(hashed_password)
    
    if not fields:
        return existing_user
    
    fields.append("updated_at = %s")
    values.append(updated_at)
    values.append(user_id)
    
    query = f"UPDATE users SET {', '.join(fields)} WHERE id = %s"
    session.execute(query, values)
    
    return get_user(session, user_id)

def delete_user(session: Session, user_id: uuid.UUID) -> bool:
    query = "DELETE FROM users WHERE id = %s"
    session.execute(query, [user_id])
    return True