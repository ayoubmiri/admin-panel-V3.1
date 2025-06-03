from fastapi import APIRouter, Depends
from app.api.deps import get_current_user
from app.database.models import User

router = APIRouter()

@router.get("/protected")
async def protected_route(user: dict = Depends(get_current_user)):
    return {"user": user}


# @router.get("/me")
# def read_me(current_user: User = Depends(get_current_user)):
#     return current_user


# from fastapi import APIRouter, Depends
# from app.api.deps import get_current_user

# router = APIRouter()



# # @router.get("/me")
# # def read_profile(user: dict = Depends(get_current_user)):
# #     return {"username": user.get("preferred_username"), "email": user.get("email")}

# @router.get("/me")
# async def get_me(current_user = Depends(get_current_user)):
#     return current_user


# # from fastapi import APIRouter, Depends, HTTPException, status
# # from fastapi.security import OAuth2PasswordRequestForm
# # from cassandra.cluster import Session
# # from app.schemas.token import Token
# # from app.core.security import verify_password, create_access_token
# # from app.api.deps import get_db
# # from datetime import timedelta
# # from app.config import settings

# # router = APIRouter()

# # @router.post("/token", response_model=Token)
# # async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), session: Session = Depends(get_db)):
# #     query = "SELECT * FROM users WHERE username = %s"
# #     user = session.execute(query, [form_data.username]).one()
# #     if not user or not verify_password(form_data.password, user.hashed_password):
# #         raise HTTPException(
# #             status_code=status.HTTP_401_UNAUTHORIZED,
# #             detail="Incorrect username or password",
# #             headers={"WWW-Authenticate": "Bearer"},
# #         )
# #     access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
# #     access_token = create_access_token(
# #         data={"sub": user.username}, expires_delta=access_token_expires
# #     )
# #     return {"access_token": access_token, "token_type": "bearer"}