from typing import Generator
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from cassandra.cluster import Session
from app.database.cassandra import get_session
from app.core.security import verify_password
from app.database.models import User
from app.config import settings

oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/token")

def get_db() -> Generator[Session, None, None]:
    session = get_session()
    try:
        yield session
    finally:
        pass  # Session is managed globally in cassandra.py

def get_current_user(session: Session = Depends(get_db), token: str = Depends(oauth2_scheme)) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    query = "SELECT * FROM users WHERE username = %s"
    user = session.execute(query, [username]).one()
    if user is None:
        raise credentials_exception
    return User(**user)


get_current_active_user = get_current_user