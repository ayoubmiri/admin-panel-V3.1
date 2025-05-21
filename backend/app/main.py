from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database.cassandra import init_cassandra
from app.routes import (
    auth, students, teachers, users,
    courses, announcements, schedule, grades
)

app = FastAPI(
    title="EST Salé Admin API",
    description="Backend for EST Salé Administration Panel",
    version="1.0.0"
)


# CORS Setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000","http://127.0.0.1:3000"],  # Your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)

# Initialize Cassandra
@app.on_event("startup")
async def startup_db_client():
    init_cassandra()

# Include routers
app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(students.router, prefix="/students", tags=["Students"])
app.include_router(teachers.router, prefix="/teachers", tags=["Teachers"])
app.include_router(courses.router, prefix="/courses", tags=["Courses"])
app.include_router(announcements.router, prefix="/announcements", tags=["Announcements"])
app.include_router(schedule.router, prefix="/schedule", tags=["Schedule"])
app.include_router(grades.router, prefix="/grades", tags=["Grades"])
app.include_router(users.router, prefix="/users", tags=["Users"])

@app.get("/")
async def root():
    return {"message": "EST Salé Admin API"}

    