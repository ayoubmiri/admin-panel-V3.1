from fastapi import APIRouter
from app.api.api_v1.endpoints import( auth, students,dashboard, 
                    teachers,filieres,modules,controls,assignments,
                    classes,elements,users,grades,
                    announcements,schedule)


api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
# api_router.include_router(dashboard.router, prefix="/dashboard", tags=["dashboard"])
api_router.include_router(students.router, prefix="/students", tags=["students"])
api_router.include_router(teachers.router, prefix="/teachers", tags=["teachers"])
api_router.include_router(filieres.router, prefix="/filieres", tags=["filieres"])
api_router.include_router(modules.router, prefix="/modules", tags=["modules"])
api_router.include_router(assignments.router, prefix="/assignments", tags=["assignments"])
api_router.include_router(elements.router, prefix="/elements", tags=["elements"])   
api_router.include_router(classes.router, prefix="/classes", tags=["classes"])

# api_router.include_router(announcements.router, prefix="/announcements", tags=["announcements"])
# api_router.include_router(schedule.router, prefix="/schedule", tags=["schedule"])
# api_router.include_router(controls.router, prefix="/controls", tags=["controls"])
# api_router.include_router(users.router, prefix="/users", tags=["users"])
# api_router.include_router(grades.router, prefix="/grades", tags=["grades"])
