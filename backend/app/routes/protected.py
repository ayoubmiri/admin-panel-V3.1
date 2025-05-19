from fastapi import APIRouter, Depends
from app.services.auth import get_current_user

router = APIRouter()

@router.get("/admin-data")
async def get_admin_data(user: dict = Depends(get_current_user)):
    """Example protected route"""
    if "admin" not in user.get("realm_access", {}).get("roles", []):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    return {"message": "Sensitive admin data"}