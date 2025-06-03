# import httpx
# import logging
# from fastapi import HTTPException
# from pydantic import BaseModel
# import os

# logger = logging.getLogger(__name__)

# class KeycloakConfig:
#     BASE_URL = os.getenv("KEYCLOAK_URL", "http://localhost:8080")
#     REALM = os.getenv("KEYCLOAK_REALM", "ent_est-realm")
#     ADMIN_USERNAME = os.getenv("KEYCLOAK_ADMIN_USERNAME", "admin")  # Replace with your admin username
#     ADMIN_PASSWORD = os.getenv("KEYCLOAK_ADMIN_PASSWORD", "admin")  # Replace with your admin password
#     CLIENT_ID = "admin-cli"

# class KeycloakUserCreate(BaseModel):
#     username: str
#     email: str
#     firstName: str
#     lastName: str
#     enabled: bool = True
#     credentials: list = []
#     realmRoles: list = []

# async def get_admin_token() -> str:
#     try:
#         async with httpx.AsyncClient() as client:
#             response = await client.post(
#                 f"{KeycloakConfig.BASE_URL}/realms/master/protocol/openid-connect/token",
#                 data={
#                     "client_id": KeycloakConfig.CLIENT_ID,
#                     "username": KeycloakConfig.ADMIN_USERNAME,
#                     "password": KeycloakConfig.ADMIN_PASSWORD,
#                     "grant_type": "password"
#                 },
#                 headers={"Content-Type": "application/x-www-form-urlencoded"}
#             )
#             response.raise_for_status()
#             return response.json()["access_token"]
#     except httpx.HTTPStatusError as e:
#         logger.error(f"Failed to get Keycloak admin token: {str(e)}")
#         raise HTTPException(status_code=500, detail="Failed to authenticate with Keycloak")

# async def create_keycloak_user(user: KeycloakUserCreate):
#     try:
#         token = await get_admin_token()
#         async with httpx.AsyncClient() as client:
#             response = await client.post(
#                 f"{KeycloakConfig.BASE_URL}/admin/realms/{KeycloakConfig.REALM}/users",
#                 json=user.dict(),
#                 headers={"Authorization": f"Bearer {token}"}
#             )
#             if response.status_code == 409:
#                 logger.warning(f"User {user.username} already exists in Keycloak")
#                 return
#             response.raise_for_status()
#             logger.debug(f"Created Keycloak user: {user.username}")
#     except httpx.HTTPStatusError as e:
#         logger.error(f"Failed to create Keycloak user {user.username}: {str(e)}")
#         raise HTTPException(status_code=500, detail=f"Failed to create Keycloak user: {str(e)}")


import httpx
import logging
from fastapi import HTTPException
from pydantic import BaseModel
import os

logger = logging.getLogger(__name__)

class KeycloakConfig:
    BASE_URL = os.getenv("KEYCLOAK_URL", "http://localhost:8080")
    REALM = os.getenv("KEYCLOAK_REALM", "ent_est-realm")
    ADMIN_USERNAME = os.getenv("KEYCLOAK_ADMIN_USERNAME", "<admin-username>")
    ADMIN_PASSWORD = os.getenv("KEYCLOAK_ADMIN_PASSWORD", "<admin-password>")
    CLIENT_ID = "admin-cli"

class KeycloakUserCreate(BaseModel):
    username: str
    email: str
    firstName: str
    lastName: str
    enabled: bool = True
    credentials: list = []
    realmRoles: list = []

async def get_admin_token() -> str:
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{KeycloakConfig.BASE_URL}/realms/master/protocol/openid-connect/token",
                data={
                    "client_id": KeycloakConfig.CLIENT_ID,
                    "username": KeycloakConfig.ADMIN_USERNAME,
                    "password": KeycloakConfig.ADMIN_PASSWORD,
                    "grant_type": "password"
                },
                headers={"Content-Type": "application/x-www-form-urlencoded"}
            )
            response.raise_for_status()
            return response.json()["access_token"]
    except httpx.HTTPStatusError as e:
        logger.error(f"Failed to get Keycloak admin token: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to authenticate with Keycloak")

async def create_keycloak_user(user: KeycloakUserCreate):
    try:
        token = await get_admin_token()
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{KeycloakConfig.BASE_URL}/admin/realms/{KeycloakConfig.REALM}/users",
                json=user.dict(),
                headers={"Authorization": f"Bearer {token}"}
            )
            if response.status_code == 409:
                logger.warning(f"User {user.username} already exists in Keycloak")
                return
            response.raise_for_status()
            logger.debug(f"Created Keycloak user: {user.username}")
    except httpx.HTTPStatusError as e:
        logger.error(f"Failed to create Keycloak user {user.username}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to create Keycloak user: {str(e)}")