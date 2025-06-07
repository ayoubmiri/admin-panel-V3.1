# # # # # # # # # from cassandra.cluster import Session
# # # # # # # # # from app.database.cassandra import get_session
# # # # # # # # # from app.database.models import User
# # # # # # # # # from typing import Generator

# # # # # # # # # def get_db() -> Generator[Session, None, None]:
# # # # # # # # #     session = get_session()
# # # # # # # # #     try:
# # # # # # # # #         yield session
# # # # # # # # #     finally:
# # # # # # # # #         pass  # Connection cleanup handled elsewhere

# # # # # # # # # # ⛔ Ignore actual JWT and Keycloak validation
# # # # # # # # # def get_current_user() -> User:
# # # # # # # # #     return User(
# # # # # # # # #         username="admin1",
# # # # # # # # #         email="testuser@example.com",
# # # # # # # # #         full_name="Test User",
# # # # # # # # #         roles=["admin"],
# # # # # # # # #     )






import httpx
from fastapi import Request, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer
from starlette.status import HTTP_401_UNAUTHORIZED
import os
from dotenv import load_dotenv

load_dotenv()

# Auth microservice URL
AUTH_SERVICE_URL = os.getenv("AUTH_SERVICE_URL", "http://auth-service:8000/verify-token")

async def get_current_user(request: Request):
    token = request.headers.get("Authorization")
    if not token or not token.startswith("Bearer "):
        raise HTTPException(status_code=HTTP_401_UNAUTHORIZED, detail="Missing or invalid token")

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                AUTH_SERVICE_URL,
                headers={"Authorization": token}
            )
            response.raise_for_status()
        return response.json()
    except httpx.HTTPError as e:
        raise HTTPException(status_code=HTTP_401_UNAUTHORIZED, detail=f"Auth service error: {str(e)}")
    


