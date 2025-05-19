# app/routes/users.py

from fastapi import APIRouter, Depends, Header, HTTPException
import httpx
import os

router = APIRouter()

KEYCLOAK_URL = os.getenv("KEYCLOAK_SERVER_URL")
REALM = os.getenv("KEYCLOAK_REALM")

async def get_current_user(authorization: str = Header(...)):
    try:
        scheme, token = authorization.split()
        if scheme.lower() != "bearer":
            raise HTTPException(status_code=401, detail="Invalid auth scheme")

        userinfo_url = f"{KEYCLOAK_URL}/realms/{REALM}/protocol/openid-connect/userinfo"
        headers = {"Authorization": f"Bearer {token}"}
        async with httpx.AsyncClient() as client:
            resp = await client.get(userinfo_url, headers=headers)

        if resp.status_code != 200:
            raise HTTPException(status_code=401, detail="Invalid token")

        return resp.json()
    except Exception as e:
        raise HTTPException(status_code=401, detail="Token validation failed")

@router.get("/me")
async def read_users_me(current_user: dict = Depends(get_current_user)):
    return current_user
