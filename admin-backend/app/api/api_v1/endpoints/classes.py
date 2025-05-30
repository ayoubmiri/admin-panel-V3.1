from fastapi import APIRouter, HTTPException, Depends
from typing import List
from uuid import UUID
from app.schemas.classes import ClassCreateSchema, ClassSchema, ClassUpdateSchema
from app.services.classes import (
    create_class_service,
    get_class_service,
    get_all_classes_service,
    list_classes_service,
    update_class_service,
    delete_class_service,
)
from app.api.deps import get_current_user
from app.database.models import User

router = APIRouter()

@router.post("/", response_model=ClassSchema)
async def create_class_endpoint(
    data: ClassCreateSchema,
    current_user: User = Depends(get_current_user),
):
    return create_class_service(data)

@router.get("/{filiere_id}/{code}", response_model=ClassSchema)
async def get_class_endpoint(
    filiere_id: UUID,
    code: str,
    current_user: User = Depends(get_current_user),
):
    result = get_class_service(filiere_id, code)
    if not result:
        raise HTTPException(status_code=404, detail="Class not found")
    return result

@router.get("/", response_model=dict)
async def list_all_classes_endpoint(
    skip: int = 0,
    limit: int = 100,
    search: str = '',
    current_user: User = Depends(get_current_user),
):
    return get_all_classes_service(skip=skip, limit=limit, search=search)

@router.get("/filiere/{filiere_id}", response_model=dict)
async def list_classes_by_filiere_endpoint(
    filiere_id: UUID,
    skip: int = 0,
    limit: int = 100,
    search: str = '',
    current_user: User = Depends(get_current_user),
):
    return list_classes_service(filiere_id, skip=skip, limit=limit, search=search)

@router.put("/{filiere_id}/{code}", response_model=ClassSchema)
async def update_class_endpoint(
    filiere_id: UUID,
    code: str,
    data: ClassUpdateSchema,
    current_user: User = Depends(get_current_user),
):
    result = update_class_service(filiere_id, code, data)
    if not result:
        raise HTTPException(status_code=404, detail="Class not found")
    return result

@router.delete("/{filiere_id}/{code}", response_model=dict)
async def delete_class_endpoint(
    filiere_id: UUID,
    code: str,
    current_user: User = Depends(get_current_user),
):
    result = delete_class_service(filiere_id, code)
    if not result:
        raise HTTPException(status_code=404, detail="Class not found")
    return {"success": True}












# from fastapi import APIRouter, HTTPException, Depends
# from typing import List
# from uuid import UUID
# from app.schemas.classes import ClassCreateSchema, ClassSchema, ClassUpdateSchema
# from app.services.classes import (
#     create_class,
#     get_class,
#     get_all_classes,
#     list_classes_by_filiere,
#     update_class,
#     delete_class
# )
# from app.api.deps import get_current_user
# from app.database.models import User

# router = APIRouter(prefix="/classes", tags=["Classes"])

# @router.post("/", response_model=ClassSchema)
# async def create_class_endpoint(
#     data: ClassCreateSchema,
#     current_user: User = Depends(get_current_user),
# ):
#     return create_class(data)

# @router.get("/{filiere_id}/{code}", response_model=ClassSchema)
# async def get_class_endpoint(
#     filiere_id: UUID,
#     code: str,
#     current_user: User = Depends(get_current_user),
# ):
#     result = get_class(filiere_id, code)
#     if not result:
#         raise HTTPException(status_code=404, detail="Class not found")
#     return result

# @router.get("/", response_model=List[ClassSchema])
# async def list_all_classes_endpoint(
#     skip: int = 0,
#     limit: int = 100,
#     current_user: User = Depends(get_current_user),
# ):
#     return get_all_classes(skip=skip, limit=limit)

# @router.get("/filiere/{filiere_id}", response_model=List[ClassSchema])
# async def list_classes_by_filiere_endpoint(
#     filiere_id: UUID,
#     skip: int = 0,
#     limit: int = 100,
#     current_user: User = Depends(get_current_user),
# ):
#     return list_classes_by_filiere(filiere_id, skip=skip, limit=limit)

# @router.put("/{filiere_id}/{code}", response_model=ClassSchema)
# async def update_class_endpoint(
#     filiere_id: UUID,
#     code: str,
#     data: ClassUpdateSchema,
#     current_user: User = Depends(get_current_user),
# ):
#     result = update_class(filiere_id, code, data)
#     if not result:
#         raise HTTPException(status_code=404, detail="Class not found")
#     return result

# @router.delete("/{filiere_id}/{code}", response_model=dict)
# async def delete_class_endpoint(
#     filiere_id: UUID,
#     code: str,
#     current_user: User = Depends(get_current_user),
# ):
#     result = delete_class(filiere_id, code)
#     if not result:
#         raise HTTPException(status_code=404, detail="Class not found")
#     return {"success": True}





# # from fastapi import APIRouter, HTTPException
# # from typing import List
# # from uuid import UUID

# # from app.schemas.classes import (
# #     ClassCreateSchema, ClassSchema,
# #     ClassUpdateSchema
# # )
# # from app.services import classes as service

# # router = APIRouter(prefix="/classes", tags=["Classes"])

# # @router.post("/", response_model=ClassSchema)
# # def create_class_endpoint(data: ClassCreateSchema):
# #     return service.create_class_service(data)

# # @router.get("/{filiere_id}/{code}", response_model=ClassSchema)
# # def get_class_endpoint(filiere_id: UUID, code: str):
# #     result = service.get_class_service(filiere_id, code)
# #     if not result:
# #         raise HTTPException(status_code=404, detail="Class not found")
# #     return result

# # @router.get("/filiere/{filiere_id}", response_model=List[ClassSchema])
# # def list_classes_endpoint(filiere_id: UUID):
# #     return service.list_classes_service(filiere_id)

# # @router.put("/{filiere_id}/{code}", response_model=ClassSchema)
# # def update_class_endpoint(filiere_id: UUID, code: str, data: ClassUpdateSchema):
# #     result = service.update_class_service(filiere_id, code, data)
# #     if not result:
# #         raise HTTPException(status_code=404, detail="Class not found")
# #     return result

# # @router.delete("/{filiere_id}/{code}")
# # def delete_class_endpoint(filiere_id: UUID, code: str):
# #     result = service.delete_class_service(filiere_id, code)
# #     if not result:
# #         raise HTTPException(status_code=404, detail="Class not found")
# #     return {"success": True}
