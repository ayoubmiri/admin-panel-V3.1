



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
    


