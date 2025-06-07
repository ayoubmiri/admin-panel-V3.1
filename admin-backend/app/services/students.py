# # from typing import List, Optional
# # from uuid import UUID
# # import logging
# # from app.schemas.students import StudentCreate, StudentUpdate, StudentInDB
# # from app.crud.students import (
# #     get_student as crud_get_student,
# #     create_student as crud_create_student,
# #     get_students as crud_get_students,
# #     update_student as crud_update_student,
# #     delete_student as crud_delete_student,
# # )

# # logging.basicConfig(level=logging.DEBUG, filename='app.log')
# # logger = logging.getLogger(__name__)


# # def get_students(skip: int = 0, limit: int = 100) -> List[StudentInDB]:
# #     return crud_get_students(skip=skip, limit=limit)

# # def get_student(student_id: UUID) -> Optional[StudentInDB]:
# #     return crud_get_student(student_id)

# # def create_student(student: StudentCreate) -> StudentInDB:
# #     logger.debug(f"Calling crud_create_student with data: {student.dict()}")
# #     return crud_create_student(student)

# # def update_student(student_id: UUID, student: StudentUpdate) -> Optional[StudentInDB]:
# #     return crud_update_student(student_id, student)

# # def delete_student(student_id: UUID) -> bool:
# #     return crud_delete_student(student_id)




# from typing import List, Optional
# from uuid import UUID
# import logging
# from app.schemas.students import StudentCreate, StudentUpdate, StudentInDB
# from app.crud.students import (
#     get_student as crud_get_student,
#     create_student as crud_create_student,
#     get_students as crud_get_students,
#     update_student as crud_update_student,
#     delete_student as crud_delete_student,
# )
# from keycloak import KeycloakAdmin
# from fastapi import HTTPException
# from app.config import settings
# import os

# logging.basicConfig(level=logging.DEBUG, filename='app.log')
# logger = logging.getLogger(__name__)

# def get_keycloak_admin():
#     try:
#         keycloak_admin = KeycloakAdmin(
#             server_url=settings.KEYCLOAK_URL,
#             username=settings.KEYCLOAK_ADMIN_USERNAME,
#             password=settings.KEYCLOAK_ADMIN_PASSWORD,
#             realm_name=settings.KEYCLOAK_REALM,
#             client_id=settings.KEYCLOAK_CLIENT_ID,
#             client_secret_key=settings.KEYCLOAK_CLIENT_SECRET,
#             verify=True
#         )
#         logger.debug(f"Successfully initialized Keycloak admin client for realm {settings.KEYCLOAK_REALM}")
#         return keycloak_admin
#     except Exception as e:
#         logger.error(f"Failed to initialize Keycloak admin client: {str(e)}")
#         raise HTTPException(status_code=500, detail=f"Keycloak configuration error: {str(e)}")

# def create_student(student: StudentCreate) -> StudentInDB:
#     logger.debug(f"Calling crud_create_student with data: {student.dict()}")
    
#     # Create student in Cassandra
#     try:
#         created_student = crud_create_student(student)
#     except Exception as e:
#         logger.error(f"Failed to create student in Cassandra: {str(e)}")
#         raise HTTPException(status_code=500, detail=f"Failed to create student in database: {str(e)}")
    
#     # Create user in Keycloak
#     try:
#         keycloak_admin = get_keycloak_admin()
#         user_data = {
#             "username": student.email,
#             "email": student.email,
#             "firstName": student.first_name,
#             "lastName": student.last_name,
#             "enabled": True,
#             "attributes": {
#                 "student_id": student.student_id
#             },
#             "realmRoles": ["etudiant"],
#             "clientRoles": { "account": ["view-profile"] },
#             "credentials": [
#                 {
#                     "type": "password",
#                     "value": "password",  # Replace with secure password generation or input
#                     "temporary": True
#                 }
#             ]

#         }
#         keycloak_admin.create_user(user_data, exist_ok=False)
#         logger.info(f"Created Keycloak user for student_id: {student.student_id}")
#     except Exception as e:
#         logger.error(f"Failed to create Keycloak user for student_id {student.student_id}: {str(e)}")
#         # Roll back Cassandra creation
#         try:
#             crud_delete_student(created_student.id)
#             logger.info(f"Rolled back Cassandra student creation for student_id: {student.student_id}")
#         except Exception as rollback_e:
#             logger.error(f"Failed to roll back Cassandra student creation: {str(rollback_e)}")
#         raise HTTPException(status_code=500, detail=f"Failed to create Keycloak user: {str(e)}")

#     return created_student

# def get_students(skip: int = 0, limit: int = 100) -> List[StudentInDB]:
#     return crud_get_students(skip=skip, limit=limit)

# def get_student(student_id: UUID) -> Optional[StudentInDB]:
#     return crud_get_student(student_id)

# def update_student(student_id: UUID, student: StudentUpdate) -> Optional[StudentInDB]:
#     return crud_update_student(student_id, student)

# def delete_student(student_id: UUID) -> bool:
#     return crud_delete_student(student_id)











from typing import List, Optional
from uuid import UUID
import logging
import secrets
import string
from app.schemas.students import StudentCreate, StudentUpdate, StudentInDB
from app.crud.students import (
    get_student as crud_get_student,
    create_student as crud_create_student,
    get_students as crud_get_students,
    update_student as crud_update_student,
    delete_student as crud_delete_student,
)
from keycloak import KeycloakAdmin
from fastapi import HTTPException
from app.config import settings

logging.basicConfig(level=logging.DEBUG, filename='app.log')
logger = logging.getLogger(__name__)

def get_keycloak_admin():
    try:
        logger.debug(f"Attempting to initialize Keycloak admin client with username: {settings.KEYCLOAK_ADMIN_USERNAME}")
        keycloak_admin = KeycloakAdmin(
            server_url=settings.KEYCLOAK_URL,
            username=settings.KEYCLOAK_ADMIN_USERNAME,
            password=settings.KEYCLOAK_ADMIN_PASSWORD,
            realm_name=settings.KEYCLOAK_REALM,
            client_id=settings.KEYCLOAK_CLIENT_ID,
            client_secret_key=settings.KEYCLOAK_CLIENT_SECRET,
            verify=True
        )
        logger.debug(f"Successfully initialized Keycloak admin client for realm {settings.KEYCLOAK_REALM}")
        return keycloak_admin
    except Exception as e:
        logger.error(f"Failed to initialize Keycloak admin client: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Keycloak configuration error: {str(e)}")

def create_student(student: StudentCreate) -> StudentInDB:
    logger.debug(f"Calling crud_create_student with data: {student.dict()}")
    
    # Create student in Cassandra
    try:
        created_student = crud_create_student(student)
        logger.info(f"Created student in Cassandra: student_id={student.student_id}")
    except Exception as e:
        logger.error(f"Failed to create student in Cassandra: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to create student in database: {str(e)}")
    
    # Create user in Keycloak
    try:
        keycloak_admin = get_keycloak_admin()
        # Generate secure random password
        password = ''.join(secrets.choice(string.ascii_letters + string.digits) for _ in range(12))
        user_data = {
            "username": student.email,
            "email": student.email,
            "firstName": student.first_name,
            "lastName": student.last_name,
            "enabled": True,
            "attributes": {
                "student_id": student.student_id
            },
            "credentials": [
                {
                    "type": "password",
                    "value": password,
                    "temporary": True
                }
            ]
        }
        # Create user
        user_id = keycloak_admin.create_user(user_data, exist_ok=False)
        logger.info(f"Created Keycloak user for student_id: {student.student_id}, user_id: {user_id}")
        
        # Assign 'etudiant' role
        try:
            role = keycloak_admin.get_realm_role("etudiant")
            keycloak_admin.assign_realm_roles(user_id=user_id, roles=[role])
            logger.info(f"Assigned 'etudiant' role to Keycloak user_id: {user_id}")
        except Exception as role_e:
            logger.error(f"Failed to assign 'etudiant' role for student_id {student.student_id}: {str(role_e)}")
            # Attempt to delete the Keycloak user
            try:
                keycloak_admin.delete_user(user_id=user_id)
                logger.info(f"Deleted Keycloak user_id {user_id} due to role assignment failure")
            except Exception as delete_e:
                logger.error(f"Failed to delete Keycloak user_id {user_id}: {str(delete_e)}")
            # Roll back Cassandra creation
            try:
                crud_delete_student(created_student.id)
                logger.info(f"Rolled back Cassandra student creation for student_id: {student.student_id}")
            except Exception as rollback_e:
                logger.error(f"Failed to roll back Cassandra student creation: {str(rollback_e)}")
            raise HTTPException(status_code=500, detail=f"Failed to assign Keycloak role: {str(role_e)}")
    except Exception as e:
        logger.error(f"Failed to create Keycloak user for student_id {student.student_id}: {str(e)}")
        # Roll back Cassandra creation
        try:
            crud_delete_student(created_student.id)
            logger.info(f"Rolled back Cassandra student creation for student_id: {student.student_id}")
        except Exception as rollback_e:
            logger.error(f"Failed to roll back Cassandra student creation: {str(rollback_e)}")
        raise HTTPException(status_code=500, detail=f"Failed to create Keycloak user: {str(e)}")

    return created_student

def get_students(skip: int = 0, limit: int = 100) -> List[StudentInDB]:
    return crud_get_students(skip=skip, limit=limit)

def get_student(student_id: UUID) -> Optional[StudentInDB]:
    return crud_get_student(student_id)

def update_student(student_id: UUID, student: StudentUpdate) -> Optional[StudentInDB]:
    return crud_update_student(student_id, student)

def delete_student(student_id: UUID) -> bool:
    return crud_delete_student(student_id)