from cassandra.cluster import Session
from app.database.cassandra import get_session
from app.database.models import User
from typing import Generator

def get_db() -> Generator[Session, None, None]:
    session = get_session()
    try:
        yield session
    finally:
        pass  # Connection cleanup handled elsewhere

# ⛔ Ignore actual JWT and Keycloak validation
def get_current_user() -> User:
    return User(
        username="admin1",
        email="testuser@example.com",
        full_name="Test User",
        roles=["admin"],
    )



# from fastapi import Depends, HTTPException, status
# from fastapi.security import OAuth2PasswordBearer
# from jose import jwt, JWTError
# import requests

# from app.config import settings

# oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")  # Dummy path, not used

# def get_public_key(token: str):
#     unverified_header = jwt.get_unverified_header(token)
#     kid = unverified_header.get("kid")
#     if not kid:
#         raise HTTPException(status_code=403, detail="Token header missing 'kid'")

#     jwks = requests.get(settings.JWKS_URL).json()
#     key = next((k for k in jwks["keys"] if k["kid"] == kid), None)
#     if not key:
#         raise HTTPException(status_code=403, detail="Public key not found")

#     return jwt.algorithms.RSAAlgorithm.from_jwk(key)

# def get_current_user(token: str = Depends(oauth2_scheme)):
#     try:
#         public_key = get_public_key(token)
#         payload = jwt.decode(
#             token,
#             public_key,
#             algorithms=["RS256"],
#             audience=settings.KEYCLOAK_CLIENT_ID,
#             issuer=f"{settings.KEYCLOAK_URL}/realms/{settings.KEYCLOAK_REALM}",
#         )
#         return payload
#     except JWTError:
#         raise HTTPException(
#             status_code=status.HTTP_401_UNAUTHORIZED,
#             detail="Invalid token",
#             headers={"WWW-Authenticate": "Bearer"},
#         )




# # import requests
# # from jose import jwt, JWTError
# # from jose.exceptions import ExpiredSignatureError

# # from fastapi import Depends, HTTPException, status
# # from fastapi.security import OAuth2PasswordBearer
# # from cassandra.cluster import Session
# # from app.database.cassandra import get_session
# # from app.database.models import User
# # from app.config import settings
# # from jose.utils import base64url_decode
# # from cryptography.hazmat.primitives.asymmetric import rsa
# # from cryptography.hazmat.backends import default_backend
# # from typing import Dict, Generator

# # oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/token")

# # def get_db() -> Generator[Session, None, None]:
# #     session = get_session()
# #     try:
# #         yield session
# #     finally:
# #         pass  # Managed globally in cassandra.py


# # def get_signing_key(token: str) -> Dict:
# #     jwks_url = settings.JWKS_URL
# #     jwks = requests.get(jwks_url).json()

# #     unverified_header = jwt.get_unverified_header(token)
# #     kid = unverified_header.get("kid")
# #     if not kid:
# #         raise HTTPException(status_code=403, detail="Missing 'kid' in token header")

# #     for key in jwks["keys"]:
# #         if key["kid"] == kid:
# #             return key

# #     raise HTTPException(status_code=403, detail="Public key not found in JWKS")



# # # def get_public_key_from_jwks(token: str):
# # #     try:
# # #         unverified_header = jwt.get_unverified_header(token)
# # #         kid = unverified_header["kid"]

# # #         jwks_response = requests.get(settings.JWKS_URL)
# # #         jwks_response.raise_for_status()
# # #         jwks = jwks_response.json()

# # #         key_data = next((k for k in jwks["keys"] if k["kid"] == kid), None)
# # #         if not key_data:
# # #             raise HTTPException(status_code=401, detail="Public key not found in JWKS")

# # #         n = int.from_bytes(base64url_decode(key_data["n"]), "big")
# # #         e = int.from_bytes(base64url_decode(key_data["e"]), "big")

# # #         public_key = rsa.RSAPublicNumbers(e, n).public_key(default_backend())
# # #         return public_key
# # #     except Exception as e:
# # #         raise HTTPException(
# # #             status_code=status.HTTP_401_UNAUTHORIZED,
# # #             detail=f"JWKS key retrieval or decoding failed: {e}",
# # #             headers={"WWW-Authenticate": "Bearer"},
# # #         )

# # def get_current_user(session: Session = Depends(get_session), token: str = Depends(oauth2_scheme)) -> User:
# #     credentials_exception = HTTPException(
# #         status_code=status.HTTP_401_UNAUTHORIZED,
# #         detail="Could not validate credentials",
# #         headers={"WWW-Authenticate": "Bearer"},
# #     )
# #     try:
# #         key_data = get_signing_key(token)
# #         public_key = jwt.algorithms.RSAAlgorithm.from_jwk(key_data)
# #         payload = jwt.decode(
# #             token,
# #             public_key,
# #             algorithms=["RS256"],
# #             audience=settings.KEYCLOAK_CLIENT_ID,
# #             issuer=f"{settings.KEYCLOAK_URL}/realms/{settings.KEYCLOAK_REALM}"
# #         )
# #         username: str = payload.get("preferred_username")
# #         if not username:
# #             raise credentials_exception
# #     except (JWTError, ExpiredSignatureError) as e:
# #         raise credentials_exception from e

# #     query = "SELECT * FROM users WHERE username = %s"
# #     user = session.execute(query, [username]).one()
# #     if user is None:
# #         raise credentials_exception
# #     return User(**user)




# # # def get_current_user(session: Session = Depends(get_db), token: str = Depends(oauth2_scheme)) -> User:
# # #     credentials_exception = HTTPException(
# # #         status_code=status.HTTP_401_UNAUTHORIZED,
# # #         detail="Could not validate credentials",
# # #         headers={"WWW-Authenticate": "Bearer"},
# # #     )

# # #     try:
# # #         public_key = get_public_key_from_jwks(token)
# # #         payload = jwt.decode(
# # #             token,
# # #             public_key,
# # #             algorithms=["RS256"],
# # #             options={"verify_aud": False},  # Disable audience validation unless you explicitly set it
# # #         )
# # #         username = payload.get("preferred_username") or payload.get("sub")
# # #         if username is None:
# # #             raise credentials_exception
# # #     except JWTError:
# # #         raise credentials_exception

# # #     query = "SELECT * FROM users WHERE username = %s"
# # #     user = session.execute(query, [username]).one()
# # #     if user is None:
# # #         raise credentials_exception

# # #     return User(**user)

# # get_current_active_user = get_current_user



# # # from typing import Generator
# # # from fastapi import Depends, HTTPException, status
# # # from fastapi.security import OAuth2PasswordBearer
# # # from jose import JWTError, jwt
# # # from cassandra.cluster import Session
# # # from app.database.cassandra import get_session
# # # from app.core.security import verify_password
# # # from app.database.models import User
# # # from app.config import settings

# # # # oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/token")
# # # oauth2_scheme = OAuth2PasswordBearer(tokenUrl="http://localhost:8000/api/v1/auth/token")

# # # def get_db() -> Generator[Session, None, None]:
# # #     session = get_session()
# # #     try:
# # #         yield session
# # #     finally:
# # #         pass  # Session is managed globally in cassandra.py

# # # def get_current_user(session: Session = Depends(get_db), token: str = Depends(oauth2_scheme)) -> User:
# # #     credentials_exception = HTTPException(
# # #         status_code=status.HTTP_401_UNAUTHORIZED,
# # #         detail="Could not validate credentials",
# # #         headers={"WWW-Authenticate": "Bearer"},
# # #     )
# # #     try:
# # #         payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
# # #         username: str = payload.get("sub")
# # #         if username is None:
# # #             raise credentials_exception
# # #     except JWTError:
# # #         raise credentials_exception
# # #     query = "SELECT * FROM users WHERE username = %s"
# # #     user = session.execute(query, [username]).one()
# # #     if user is None:
# # #         raise credentials_exception
# # #     return User(**user)

# # # get_current_active_user = get_current_user