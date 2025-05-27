from fastapi import APIRouter
from app.api.api_v1.endpoints import( auth, students, 
                    teachers,filieres,modules,controls,
                    classes,elements,users,grades,
                    announcements,schedule,courses)

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(students.router, prefix="/students", tags=["students"])
api_router.include_router(teachers.router, prefix="/teachers", tags=["teachers"])
api_router.include_router(filieres.router, prefix="/filieres", tags=["filieres"])
api_router.include_router(modules.router, prefix="/modules", tags=["modules"])
# api_router.include_router(controls.router, prefix="/controls", tags=["controls"])
# api_router.include_router(classes.router, prefix="/classes", tags=["classes"])
api_router.include_router(elements.router, prefix="/elements", tags=["elements"])   
# api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(grades.router, prefix="/grades", tags=["grades"])
