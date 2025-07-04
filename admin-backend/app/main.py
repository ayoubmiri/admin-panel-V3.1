# # from fastapi import FastAPI
# # from fastapi.middleware.cors import CORSMiddleware
# # from app.database.cassandra import init_cassandra
# # from cassandra.cqlengine.management import sync_table
# # from app.database.models import Student, Filiere,Teacher,Module,Announcement,Element,FinalExam, TeacherElementAssignment
# # from dotenv import load_dotenv
# # from app.api.api_v1.api_v1 import api_router


# # app = FastAPI(
# #     title="EST Salé Admin API",
# #     description="Backend for EST Salé Administration Panel",
# #     version="1.0.0"
# # )

# # load_dotenv()
# # # CORS Setup
# # app.add_middleware(
# #     CORSMiddleware,
# #     allow_origins=["http://localhost:3000","http://127.0.0.1:3000"],  # Your frontend URL
# #     allow_credentials=True,
# #     allow_methods=["*"],
# #     allow_headers=["*"],
# #     expose_headers=["*"]
# # )

# # # Initialize Cassandra
# # @app.on_event("startup")
# # async def startup_db_client():
# #     init_cassandra()

# #     # sync tables AFTER connection registered
# #     sync_table(Student)
# #     sync_table(Teacher)
# #     sync_table(Element)
# #     # sync_table(Control)
# #     sync_table(Module)
# #     # sync_table(Grade)
# #     sync_table(Filiere)
# #     sync_table(TeacherElementAssignment)




# #  # Include routers
# # app.include_router(api_router, prefix="/api/v1", tags=["API v1"])

# # @app.get("/")
# # async def root():
# #     return {"message": "EST Salé Admin API"}

    

# from fastapi import FastAPI
# from fastapi.middleware.cors import CORSMiddleware
# from app.database.cassandra import init_cassandra
# from cassandra.cqlengine.management import sync_table
# from app.database.models import Student, Filiere, Teacher, Module, Class , Announcement, Element, FinalExam, TeacherElementAssignment
# from dotenv import load_dotenv
# from app.api.api_v1.api_v1 import api_router
# import os

# # Load environment variables
# load_dotenv()
# print("KEYCLOAK_URL: is", os.getenv("KEYCLOAK_URL"))  # Debug env loading

# app = FastAPI(
#     title="EST Salé Admin API",
#     description="Backend for EST Salé Administration Panel",
#     version="1.0.0"
# )

# # CORS Setup
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=[
#         "http://localhost:3000",
#         "http://localhost:3001",
#         "http://localhost:8000",  # Add Keycloak callback
#         "http://localhost:8001",

#         "http://127.0.0.1:8000",  # Add Keycloak callback
#         "http://127.0.0.1:8001", # Ensure FastAPI itself # Ensure FastAPI itself
#         "http://127.0.0.1:3000",
#         "http://127.0.0.1:3001",

#         "http://192.168.1.30:3000",
#         "http://192.168.1.30:3001",
#         "http://192.168.1.30:8000",  # Add Keycloak callback
#         "http://192.168.1.30:8001"   # Ensure FastAPI itself
#     ],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
#     expose_headers=["*"]
# )

# # Initialize Cassandra
# @app.on_event("startup")
# async def startup_db_client():
#     init_cassandra()
#     # Sync tables
#     sync_table(Student)
#     sync_table(Teacher)
#     sync_table(Filiere)
#     sync_table(Module)
#     sync_table(Element)
#     sync_table(Class)
#     # sync_table(TeacherElementAssignment)
#     # sync_table(Announcement)
#     # sync_table(FinalExam)

# # Include routers
# app.include_router(api_router, prefix="/api/v1", tags=["API v1"])

# @app.get("/")
# async def root():
#     return {"message": "EST Salé Admin API"}



from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database.cassandra import init_cassandra
from cassandra.cqlengine.management import sync_table
from app.database.models import Student, Filiere, Teacher, Module, Class, Element
from dotenv import load_dotenv
from app.api.api_v1.api_v1 import api_router
import os

# Load environment variables from .env
load_dotenv()

# Debug log
print("KEYCLOAK_URL:", os.getenv("KEYCLOAK_URL"))

# Load CORS origins from .env
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "").split(",")

app = FastAPI(
    title=os.getenv("API_TITLE", "EST Salé Admin API"),
    description=os.getenv("API_DESCRIPTION", "Backend for EST Salé Administration Panel"),
    version=os.getenv("API_VERSION", "1.0.0")
)

# CORS Setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)

# Initialize Cassandra tables
@app.on_event("startup")
async def startup_db_client():
    init_cassandra()
    sync_table(Student)
    sync_table(Teacher)
    sync_table(Filiere)
    sync_table(Module)
    sync_table(Element)
    sync_table(Class)
    # Optional:
    # sync_table(TeacherElementAssignment)
    # sync_table(Announcement)
    # sync_table(FinalExam)

# Include API routers
app.include_router(api_router, prefix="/api/v1", tags=["API v1"])

@app.get("/")
async def root():
    return {"message": os.getenv("ROOT_MESSAGE", "EST Salé Admin API")}
