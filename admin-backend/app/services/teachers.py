from typing import List, Optional
from uuid import UUID
import logging
from app.schemas.teachers import TeacherCreate, TeacherUpdate, TeacherInDB
from app.crud.teachers import (
    get_teacher as crud_get_teacher,
    create_teacher as crud_create_teacher,
    get_teachers as crud_get_teachers,
    update_teacher as crud_update_teacher,
    delete_teacher as crud_delete_teacher,
)
from fastapi import HTTPException
from app.utils.keycloak import create_keycloak_user, update_keycloak_user, delete_keycloak_user

logging.basicConfig(level=logging.DEBUG, filename='app.log')
logger = logging.getLogger(__name__)

def create_new_teacher(teacher: TeacherCreate) -> TeacherInDB:
    logger.debug(f"Calling crud_create_teacher with data: {teacher.dict()}")
    
    # Create teacher in Cassandra
    try:
        created_teacher = crud_create_teacher(teacher)
        logger.info(f"Created teacher in Cassandra: teacher_id={teacher.teacher_id}")
    except Exception as e:
        logger.error(f"Failed to create teacher in Cassandra: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to create teacher in database: {str(e)}")
    
    # Create user in Keycloak with 'enseignant' role
    try:
        create_keycloak_user(
            email=teacher.email,
            first_name=teacher.first_name,
            last_name=teacher.last_name,
            custom_attributes={"teacher_id": teacher.teacher_id},
            role_name="enseignant"
        )
        logger.info(f"Created Keycloak user for teacher_id: {teacher.teacher_id}")
    except Exception as e:
        # Roll back Cassandra creation
        try:
            crud_delete_teacher(created_teacher.id)
            logger.info(f"Rolled back Cassandra teacher creation for teacher_id: {teacher.teacher_id}")
        except Exception as rollback_e:
            logger.error(f"Failed to roll back Cassandra teacher creation: {str(rollback_e)}")
        raise HTTPException(status_code=500, detail=str(e))

    return created_teacher

def update_existing_teacher(teacher_id: UUID, teacher: TeacherUpdate) -> Optional[TeacherInDB]:
    logger.debug(f"Updating teacher with teacher_id: {teacher_id}, data: {teacher.dict(exclude_unset=True)}")
    
    # Get existing teacher from Cassandra to retrieve current email
    try:
        existing_teacher = crud_get_teacher(teacher_id)
        if not existing_teacher:
            raise HTTPException(status_code=404, detail="Teacher not found")
    except Exception as e:
        logger.error(f"Failed to retrieve teacher with teacher_id {teacher_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to retrieve teacher: {str(e)}")

    # Update teacher in Cassandra
    try:
        updated_teacher = crud_update_teacher(teacher_id, teacher)
        if not updated_teacher:
            raise HTTPException(status_code=404, detail="Teacher not found")
        logger.info(f"Updated teacher in Cassandra: teacher_id={teacher_id}")
    except Exception as e:
        logger.error(f"Failed to update teacher in Cassandra: teacher_id={teacher_id}, error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to update teacher in database: {str(e)}")

    # Update user in Keycloak
    try:
        update_keycloak_user(
            current_email=existing_teacher.email,
            email=teacher.email,
            first_name=teacher.first_name,
            last_name=teacher.last_name,
            custom_attributes={"teacher_id": teacher.teacher_id} if teacher.teacher_id else None,
            role_name="enseignant"
        )
        logger.info(f"Updated Keycloak user for teacher_id: {teacher_id}")
    except Exception as e:
        # Roll back Cassandra update by restoring original data
        try:
            crud_update_teacher(teacher_id, TeacherUpdate(**existing_teacher.dict()))
            logger.info(f"Rolled back Cassandra teacher update for teacher_id: {teacher_id}")
        except Exception as rollback_e:
            logger.error(f"Failed to roll back Cassandra teacher update: {str(rollback_e)}")
        raise HTTPException(status_code=500, detail=str(e))

    return updated_teacher

def get_all_teachers(skip: int = 0, limit: int = 100) -> List[TeacherInDB]:
    return crud_get_teachers(skip=skip, limit=limit)

def get_single_teacher(teacher_id: UUID) -> Optional[TeacherInDB]:
    return crud_get_teacher(teacher_id)

def delete_existing_teacher(teacher_id: UUID) -> bool:
    logger.debug(f"Deleting teacher with teacher_id: {teacher_id}")
    
    # Get existing teacher from Cassandra to retrieve email for Keycloak deletion
    try:
        existing_teacher = crud_get_teacher(teacher_id)
        if not existing_teacher:
            logger.warning(f"Teacher with teacher_id {teacher_id} not found")
            raise HTTPException(status_code=404, detail="Teacher not found")
        logger.debug(f"Found teacher with teacher_id: {teacher_id}, email: {existing_teacher.email}")
    except Exception as e:
        logger.error(f"Failed to retrieve teacher with teacher_id {teacher_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to retrieve teacher: {str(e)}")

    # Delete teacher from Cassandra
    try:
        success = crud_delete_teacher(teacher_id)
        if not success:
            logger.warning(f"Teacher with teacher_id {teacher_id} not found in Cassandra")
            raise HTTPException(status_code=404, detail="Teacher not found")
        logger.info(f"Deleted teacher from Cassandra: teacher_id={teacher_id}")
    except Exception as e:
        logger.error(f"Failed to delete teacher from Cassandra: teacher_id={teacher_id}, error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to delete teacher from database: {str(e)}")

    # Delete user from Keycloak
    try:
        delete_keycloak_user(existing_teacher.email)
        logger.info(f"Deleted Keycloak user for teacher_id: {teacher_id}, email: {existing_teacher.email}")
    except Exception as e:
        # Log the error but do not roll back Cassandra deletion, as it's already completed
        logger.error(f"Failed to delete Keycloak user for teacher_id {teacher_id}, email: {existing_teacher.email}: {str(e)}")
        # Optionally, you can decide whether to raise an exception or continue
        # For now, we'll log the error and continue to maintain consistency with frontend success
        # raise HTTPException(status_code=500, detail=f"Failed to delete Keycloak user: {str(e)}")

    return True


# from typing import List, Optional
# from uuid import UUID
# import logging
# from app.schemas.teachers import TeacherCreate, TeacherUpdate, TeacherInDB
# from app.crud.teachers import (
#     get_teacher as crud_get_teacher,
#     create_teacher as crud_create_teacher,
#     get_teachers as crud_get_teachers,
#     update_teacher as crud_update_teacher,
#     delete_teacher as crud_delete_teacher,
# )
# from fastapi import HTTPException
# from app.utils.keycloak import create_keycloak_user, update_keycloak_user

# logging.basicConfig(level=logging.DEBUG, filename='app.log')
# logger = logging.getLogger(__name__)

# def create_new_teacher(teacher: TeacherCreate) -> TeacherInDB:
#     logger.debug(f"Calling crud_create_teacher with data: {teacher.dict()}")
    
#     # Create teacher in Cassandra
#     try:
#         created_teacher = crud_create_teacher(teacher)
#         logger.info(f"Created teacher in Cassandra: teacher_id={teacher.teacher_id}")
#     except Exception as e:
#         logger.error(f"Failed to create teacher in Cassandra: {str(e)}")
#         raise HTTPException(status_code=500, detail=f"Failed to create teacher in database: {str(e)}")
    
#     # Create user in Keycloak with 'enseignant' role
#     try:
#         create_keycloak_user(
#             email=teacher.email,
#             first_name=teacher.first_name,
#             last_name=teacher.last_name,
#             custom_attributes={"teacher_id": teacher.teacher_id},
#             role_name="enseignant"
#         )
#         logger.info(f"Created Keycloak user for teacher_id: {teacher.teacher_id}")
#     except Exception as e:
#         # Roll back Cassandra creation
#         try:
#             crud_delete_teacher(created_teacher.id)
#             logger.info(f"Rolled back Cassandra teacher creation for teacher_id: {teacher.teacher_id}")
#         except Exception as rollback_e:
#             logger.error(f"Failed to roll back Cassandra teacher creation: {str(rollback_e)}")
#         raise HTTPException(status_code=500, detail=str(e))

#     return created_teacher

# def update_existing_teacher(teacher_id: UUID, teacher: TeacherUpdate) -> Optional[TeacherInDB]:
#     logger.debug(f"Updating teacher with teacher_id: {teacher_id}, data: {teacher.dict(exclude_unset=True)}")
    
#     # Get existing teacher from Cassandra to retrieve current email
#     try:
#         existing_teacher = crud_get_teacher(teacher_id)
#         if not existing_teacher:
#             raise HTTPException(status_code=404, detail="Teacher not found")
#     except Exception as e:
#         logger.error(f"Failed to retrieve teacher with teacher_id {teacher_id}: {str(e)}")
#         raise HTTPException(status_code=500, detail=f"Failed to retrieve teacher: {str(e)}")

#     # Update teacher in Cassandra
#     try:
#         updated_teacher = crud_update_teacher(teacher_id, teacher)
#         if not updated_teacher:
#             raise HTTPException(status_code=404, detail="Teacher not found")
#         logger.info(f"Updated teacher in Cassandra: teacher_id={teacher_id}")
#     except Exception as e:
#         logger.error(f"Failed to update teacher in Cassandra: teacher_id={teacher_id}, error: {str(e)}")
#         raise HTTPException(status_code=500, detail=f"Failed to update teacher in database: {str(e)}")

#     # Update user in Keycloak
#     try:
#         update_keycloak_user(
#             current_email=existing_teacher.email,
#             email=teacher.email,
#             first_name=teacher.first_name,
#             last_name=teacher.last_name,
#             custom_attributes={"teacher_id": teacher.teacher_id} if teacher.teacher_id else None,
#             role_name="enseignant"
#         )
#         logger.info(f"Updated Keycloak user for teacher_id: {teacher_id}")
#     except Exception as e:
#         # Roll back Cassandra update by restoring original data
#         try:
#             crud_update_teacher(teacher_id, TeacherUpdate(**existing_teacher.dict()))
#             logger.info(f"Rolled back Cassandra teacher update for teacher_id: {teacher_id}")
#         except Exception as rollback_e:
#             logger.error(f"Failed to roll back Cassandra teacher update: {str(rollback_e)}")
#         raise HTTPException(status_code=500, detail=str(e))

#     return updated_teacher

# def get_all_teachers(skip: int = 0, limit: int = 100) -> List[TeacherInDB]:
#     return crud_get_teachers(skip=skip, limit=limit)

# def get_single_teacher(teacher_id: UUID) -> Optional[TeacherInDB]:
#     return crud_get_teacher(teacher_id)

# def delete_existing_teacher(teacher_id: UUID) -> bool:
#     return crud_delete_teacher(teacher_id)





