from fastapi import APIRouter, HTTPException, status, Depends, Request
from pydantic import BaseModel
import httpx
import os

router = APIRouter()

KEYCLOAK_URL = os.getenv("KEYCLOAK_SERVER_URL")
REALM = os.getenv("KEYCLOAK_REALM")
CLIENT_ID = os.getenv("KEYCLOAK_CLIENT_ID")
CLIENT_SECRET = os.getenv("KEYCLOAK_CLIENT_SECRET")  # if confidential client

class LoginRequest(BaseModel):
    username: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    expires_in: int
    refresh_expires_in: int
    token_type: str
    scope: str

@router.post("/login", response_model=TokenResponse)
async def login(data: LoginRequest):
    token_url = f"{KEYCLOAK_URL}/realms/{REALM}/protocol/openid-connect/token"
    headers = {"Content-Type": "application/x-www-form-urlencoded"}
    payload = {
        "grant_type": "password",
        "client_id": CLIENT_ID,
        "username": data.username,
        "password": data.password,
    }
    if CLIENT_SECRET:
        payload["client_secret"] = CLIENT_SECRET

    async with httpx.AsyncClient() as client:
        resp = await client.post(token_url, data=payload, headers=headers)
        if resp.status_code != 200:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid username or password"
            )
        return resp.json()
