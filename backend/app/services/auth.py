from fastapi import HTTPException, status
from app.config import settings
from keycloak import KeycloakOpenID
from jose import JWTError

# Initialize Keycloak client
keycloak_openid = KeycloakOpenID(
    server_url=settings.KEYCLOAK_URL,
    client_id=settings.KEYCLOAK_CLIENT_ID,
    realm_name=settings.KEYCLOAK_REALM,
    client_secret_key=settings.KEYCLOAK_CLIENT_SECRET
)

def get_current_user(token: str):
    """Verify and decode JWT token"""
    try:
        # Keycloak client returns the public key with '-----BEGIN PUBLIC KEY-----' headers
        public_key = keycloak_openid.public_key()
        # Decode the token
        user_info = keycloak_openid.decode_token(
            token,
            public_key,
            options={"verify_aud": True}  # Enable audience verification for better security
        )
        return user_info
    except JWTError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid token: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Authentication error: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )

def has_admin_role(user: dict):
    """Check if user has admin role"""
    return settings.ADMIN_ROLE in user.get("realm_access", {}).get("roles", [])

async def verify_keycloak_token(token: str):
    """Alternative async wrapper to verify token"""
    try:
        # Since get_current_user is sync, call it in a thread if needed or just use sync
        return get_current_user(token)
    except HTTPException as e:
        raise e

async def get_keycloak_token(username: str, password: str):
    """Get token from Keycloak"""
    try:
        # token() is sync, so wrap in async if necessary
        return keycloak_openid.token(username, password)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Keycloak authentication failed"
        )
