from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database.cassandra import init_cassandra
from cassandra.cqlengine.management import sync_table
from app.database.models import Student, Filiere,Teacher,Module,Announcement,Element,FinalExam, TeacherElementAssignment
from dotenv import load_dotenv
from app.api.api_v1.api_v1 import api_router


app = FastAPI(
    title="EST Salé Admin API",
    description="Backend for EST Salé Administration Panel",
    version="1.0.0"
)

load_dotenv()
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

    # sync tables AFTER connection registered
    sync_table(Student)
    sync_table(Teacher)
    sync_table(Element)
    # sync_table(Control)
    sync_table(Module)
    # sync_table(Grade)
    sync_table(Filiere)
    sync_table(TeacherElementAssignment)




 # Include routers
app.include_router(api_router, prefix="/api/v1", tags=["API v1"])

@app.get("/")
async def root():
    return {"message": "EST Salé Admin API"}

    