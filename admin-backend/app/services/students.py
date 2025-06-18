from typing import List, Optional
from uuid import UUID
import logging
from app.schemas.students import StudentCreate, StudentUpdate, StudentInDB
from app.crud.students import (
    get_student as crud_get_student,
    create_student as crud_create_student,
    get_students as crud_get_students,
    update_student as crud_update_student,
    delete_student as crud_delete_student,
)
from fastapi import HTTPException
from app.utils.keycloak import create_keycloak_user, update_keycloak_user, delete_keycloak_user

logging.basicConfig(level=logging.DEBUG, filename='app.log')
logger = logging.getLogger(__name__)

def create_student(student: StudentCreate) -> StudentInDB:
    logger.debug(f"Calling crud_create_student with data: {student.dict()}")
    
    # Create student in Cassandra
    try:
        created_student = crud_create_student(student)
        logger.info(f"Created student in Cassandra: student_id={student.student_id}")
    except Exception as e:
        logger.error(f"Failed to create student in Cassandra: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to create student in database: {str(e)}")
    
    # Create user in Keycloak with 'etudiant' role
    try:
        create_keycloak_user(
            email=student.email,
            first_name=student.first_name,
            last_name=student.last_name,
            custom_attributes={"student_id": student.student_id},
            role_name="etudiant"
        )
        logger.info(f"Created Keycloak user for student_id: {student.student_id}")
    except Exception as e:
        # Roll back Cassandra creation
        try:
            crud_delete_student(created_student.id)
            logger.info(f"Rolled back Cassandra student creation for student_id: {student.student_id}")
        except Exception as rollback_e:
            logger.error(f"Failed to roll back Cassandra student creation: {str(rollback_e)}")
        raise HTTPException(status_code=500, detail=str(e))

    return created_student

def update_student(student_id: UUID, student: StudentUpdate) -> Optional[StudentInDB]:
    logger.debug(f"Updating student with student_id: {student_id}, data: {student.dict(exclude_unset=True)}")
    
    # Get existing student from Cassandra to retrieve current email
    try:
        existing_student = crud_get_student(student_id)
        if not existing_student:
            raise HTTPException(status_code=404, detail="Student not found")
    except Exception as e:
        logger.error(f"Failed to retrieve student with student_id {student_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to retrieve student: {str(e)}")

    # Update student in Cassandra
    try:
        updated_student = crud_update_student(student_id, student)
        if not updated_student:
            raise HTTPException(status_code=404, detail="Student not found")
        logger.info(f"Updated student in Cassandra: student_id={student_id}")
    except Exception as e:
        logger.error(f"Failed to update student in Cassandra: student_id={student_id}, error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to update student in database: {str(e)}")

    # Update user in Keycloak
    try:
        update_keycloak_user(
            current_email=existing_student.email,
            email=student.email,
            first_name=student.first_name,
            last_name=student.last_name,
            custom_attributes={"student_id": student.student_id} if student.student_id else None,
            role_name="etudiant"
        )
        logger.info(f"Updated Keycloak user for student_id: {student_id}")
    except Exception as e:
        # Roll back Cassandra update by restoring original data
        try:
            crud_update_student(student_id, StudentUpdate(**existing_student.dict()))
            logger.info(f"Rolled back Cassandra student update for student_id: {student_id}")
        except Exception as rollback_e:
            logger.error(f"Failed to roll back Cassandra student update: {str(rollback_e)}")
        raise HTTPException(status_code=500, detail=str(e))

    return updated_student

def get_students(skip: int = 0, limit: int = 100) -> List[StudentInDB]:
    return crud_get_students(skip=skip, limit=limit)

def get_student(student_id: UUID) -> Optional[StudentInDB]:
    return crud_get_student(student_id)

def delete_student(student_id: UUID) -> bool:
    logger.debug(f"Deleting student with student_id: {student_id}")
    
    # Get existing student from Cassandra to retrieve email for Keycloak deletion
    try:
        existing_student = crud_get_student(student_id)
        if not existing_student:
            logger.warning(f"Student with student_id {student_id} not found")
            raise HTTPException(status_code=404, detail="Student not found")
        logger.debug(f"Found student with student_id: {student_id}, email: {existing_student.email}")
    except Exception as e:
        logger.error(f"Failed to retrieve student with student_id {student_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to retrieve student: {str(e)}")

    # Delete student from Cassandra
    try:
        success = crud_delete_student(student_id)
        if not success:
            logger.warning(f"Student with student_id {student_id} not found in Cassandra")
            raise HTTPException(status_code=404, detail="Student not found")
        logger.info(f"Deleted student from Cassandra: student_id={student_id}")
    except Exception as e:
        logger.error(f"Failed to delete student from Cassandra: student_id={student_id}, error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to delete student from database: {str(e)}")

    # Delete user from Keycloak
    try:
        delete_keycloak_user(existing_student.email)
        logger.info(f"Deleted Keycloak user for student_id: {student_id}, email: {existing_student.email}")
    except Exception as e:
        # Log the error but do not roll back Cassandra deletion, as it's already completed
        logger.error(f"Failed to delete Keycloak user for student_id {student_id}, email: {existing_student.email}: {str(e)}")
        # Optionally, you can decide whether to raise an exception or continue
        # For now, we'll log the error and continue to maintain consistency with frontend success
        # raise HTTPException(status_code=500, detail=f"Failed to delete Keycloak user: {str(e)}")

    return True










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
# from fastapi import HTTPException
# from app.utils.keycloak import create_keycloak_user, update_keycloak_user

# logging.basicConfig(level=logging.DEBUG, filename='app.log')
# logger = logging.getLogger(__name__)

# def create_student(student: StudentCreate) -> StudentInDB:
#     logger.debug(f"Calling crud_create_student with data: {student.dict()}")
    
#     # Create student in Cassandra
#     try:
#         created_student = crud_create_student(student)
#         logger.info(f"Created student in Cassandra: student_id={student.student_id}")
#     except Exception as e:
#         logger.error(f"Failed to create student in Cassandra: {str(e)}")
#         raise HTTPException(status_code=500, detail=f"Failed to create student in database: {str(e)}")
    
#     # Create user in Keycloak with 'etudiant' role
#     try:
#         create_keycloak_user(
#             email=student.email,
#             first_name=student.first_name,
#             last_name=student.last_name,
#             custom_attributes={"student_id": student.student_id},
#             role_name="etudiant"
#         )
#         logger.info(f"Created Keycloak user for student_id: {student.student_id}")
#     except Exception as e:
#         # Roll back Cassandra creation
#         try:
#             crud_delete_student(created_student.id)
#             logger.info(f"Rolled back Cassandra student creation for student_id: {student.student_id}")
#         except Exception as rollback_e:
#             logger.error(f"Failed to roll back Cassandra student creation: {str(rollback_e)}")
#         raise HTTPException(status_code=500, detail=str(e))

#     return created_student

# def update_student(student_id: UUID, student: StudentUpdate) -> Optional[StudentInDB]:
#     logger.debug(f"Updating student with student_id: {student_id}, data: {student.dict(exclude_unset=True)}")
    
#     # Get existing student from Cassandra to retrieve current email
#     try:
#         existing_student = crud_get_student(student_id)
#         if not existing_student:
#             raise HTTPException(status_code=404, detail="Student not found")
#     except Exception as e:
#         logger.error(f"Failed to retrieve student with student_id {student_id}: {str(e)}")
#         raise HTTPException(status_code=500, detail=f"Failed to retrieve student: {str(e)}")

#     # Update student in Cassandra
#     try:
#         updated_student = crud_update_student(student_id, student)
#         if not updated_student:
#             raise HTTPException(status_code=404, detail="Student not found")
#         logger.info(f"Updated student in Cassandra: student_id={student_id}")
#     except Exception as e:
#         logger.error(f"Failed to update student in Cassandra: student_id={student_id}, error: {str(e)}")
#         raise HTTPException(status_code=500, detail=f"Failed to update student in database: {str(e)}")

#     # Update user in Keycloak
#     try:
#         update_keycloak_user(
#             current_email=existing_student.email,
#             email=student.email,
#             first_name=student.first_name,
#             last_name=student.last_name,
#             custom_attributes={"student_id": student.student_id} if student.student_id else None,
#             role_name="etudiant"
#         )
#         logger.info(f"Updated Keycloak user for student_id: {student_id}")
#     except Exception as e:
#         # Roll back Cassandra update by restoring original data
#         try:
#             crud_update_student(student_id, StudentUpdate(**existing_student.dict()))
#             logger.info(f"Rolled back Cassandra student update for student_id: {student_id}")
#         except Exception as rollback_e:
#             logger.error(f"Failed to roll back Cassandra student update: {str(rollback_e)}")
#         raise HTTPException(status_code=500, detail=str(e))

#     return updated_student

# def get_students(skip: int = 0, limit: int = 100) -> List[StudentInDB]:
#     return crud_get_students(skip=skip, limit=limit)

# def get_student(student_id: UUID) -> Optional[StudentInDB]:
#     return crud_get_student(student_id)

# def delete_student(student_id: UUID) -> bool:
#     return crud_delete_student(student_id)