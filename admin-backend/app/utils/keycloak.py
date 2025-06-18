import logging
import secrets
import string
import re
from typing import Optional, Dict
from uuid import uuid4
from keycloak import KeycloakAdmin
from fastapi import HTTPException
from app.config import settings

logger = logging.getLogger(__name__)

def generate_username(first_name: str, last_name: str) -> str:
    """
    Generate a unique username based on first_name and last_name with a random suffix.
    Fallback to UUID-based username if names are invalid.
    """
    # Clean names: remove special characters and convert to lowercase
    clean_first = re.sub(r'[^\w\s]', '', first_name.lower()).strip() if first_name else ""
    clean_last = re.sub(r'[^\w\s]', '', last_name.lower()).strip() if last_name else ""
    
    if clean_first and clean_last:
        base_username = f"{clean_first}.{clean_last}"
    else:
        # Fallback to UUID-based username
        base_username = f"user_{str(uuid4())[:8]}"
    
    return base_username

def create_keycloak_user(
    email: str,
    first_name: str,
    last_name: str,
    custom_attributes: Dict,
    role_name: str
) -> str:
    """
    Create a user in Keycloak with a generated username, specified role, and custom attributes.
    Returns the Keycloak user ID.
    """
    try:
        keycloak_admin = KeycloakAdmin(
            server_url=settings.KEYCLOAK_URL,
            username=settings.KEYCLOAK_ADMIN_USERNAME,
            password=settings.KEYCLOAK_ADMIN_PASSWORD,
            realm_name=settings.KEYCLOAK_REALM,
            client_id=settings.KEYCLOAK_CLIENT_ID,
            client_secret_key=settings.KEYCLOAK_CLIENT_SECRET,
            verify=True
        )
        logger.debug(f"Initialized Keycloak admin client for realm {settings.KEYCLOAK_REALM}")

        # Generate unique username
        username = generate_username(first_name, last_name)
        attempt = 1
        max_attempts = 5
        while attempt <= max_attempts:
            # Check if username exists
            existing_users = keycloak_admin.get_users(query={"username": username})
            if not existing_users:
                break
            # If username exists, append a new random suffix
            random_suffix = ''.join(secrets.choice(string.digits) for _ in range(4))
            username = f"{username.split('.')[0]}.{username.split('.')[1]}.{random_suffix}" if '.' in username else f"user_{str(uuid4())[:8]}"
            attempt += 1
        if attempt > max_attempts:
            logger.error(f"Failed to generate unique username after {max_attempts} attempts")
            raise HTTPException(status_code=500, detail="Failed to generate unique username")

        # Generate secure random password
        password = ''.join(secrets.choice(string.ascii_letters + string.digits) for _ in range(12))
        user_data = {
            "username": username,
            "email": email,
            "firstName": first_name,
            "lastName": last_name,
            "enabled": True,
            "attributes": custom_attributes,
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
        logger.info(f"Created Keycloak user with username: {username}, email: {email}, user_id: {user_id}")

        # Assign role
        try:
            role = keycloak_admin.get_realm_role(role_name)
            keycloak_admin.assign_realm_roles(user_id=user_id, roles=[role])
            logger.info(f"Assigned '{role_name}' role to Keycloak user_id: {user_id}")
        except Exception as role_e:
            logger.error(f"Failed to assign '{role_name}' role for username {username}: {str(role_e)}")
            # Delete the user if role assignment fails
            try:
                keycloak_admin.delete_user(user_id=user_id)
                logger.info(f"Deleted Keycloak user_id {user_id} due to role assignment failure")
            except Exception as delete_e:
                logger.error(f"Failed to delete Keycloak user_id {user_id}: {str(delete_e)}")
            raise HTTPException(status_code=500, detail=f"Failed to assign Keycloak role: {str(role_e)}")

        return user_id

    except Exception as e:
        logger.error(f"Failed to create Keycloak user for email {email}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to create Keycloak user: {str(e)}")

def update_keycloak_user(
    current_email: str,
    email: Optional[str],
    first_name: Optional[str],
    last_name: Optional[str],
    custom_attributes: Optional[Dict],
    role_name: str
) -> str:
    """
    Update a Keycloak user's details and ensure the specified role is assigned.
    Returns the Keycloak user ID.
    """
    try:
        keycloak_admin = KeycloakAdmin(
            server_url=settings.KEYCLOAK_URL,
            username=settings.KEYCLOAK_ADMIN_USERNAME,
            password=settings.KEYCLOAK_ADMIN_PASSWORD,
            realm_name=settings.KEYCLOAK_REALM,
            client_id=settings.KEYCLOAK_CLIENT_ID,
            client_secret_key=settings.KEYCLOAK_CLIENT_SECRET,
            verify=True
        )
        logger.debug(f"Initialized Keycloak admin client for realm {settings.KEYCLOAK_REALM}")

        # Find user by current email
        users = keycloak_admin.get_users(query={"email": current_email})
        if not users:
            logger.error(f"Keycloak user with email {current_email} not found")
            raise HTTPException(status_code=404, detail=f"Keycloak user with email {current_email} not found")
        user_id = users[0]["id"]
        logger.debug(f"Found Keycloak user_id: {user_id} for email: {current_email}")

        # Prepare update data
        update_data = {}
        if email is not None:
            update_data["email"] = email
        if first_name is not None:
            update_data["firstName"] = first_name
        if last_name is not None:
            update_data["lastName"] = last_name
        if custom_attributes is not None:
            update_data["attributes"] = custom_attributes

        # Update user details
        if update_data:
            try:
                keycloak_admin.update_user(user_id=user_id, payload=update_data)
                logger.info(f"Updated Keycloak user details for user_id: {user_id}, update_data: {update_data}")
            except Exception as update_e:
                logger.error(f"Failed to update Keycloak user_id {user_id}: {str(update_e)}")
                raise HTTPException(status_code=500, detail=f"Keycloak update failed: {str(update_e)}")
        else:
            logger.debug(f"No user details to update for Keycloak user_id: {user_id}")

        # Ensure the specified role is assigned
        try:
            # Get current roles
            current_roles = keycloak_admin.get_realm_roles_of_user(user_id=user_id)
            current_role_names = [role["name"] for role in current_roles]
            
            # Check if the desired role is assigned
            if role_name not in current_role_names:
                role = keycloak_admin.get_realm_role(role_name)
                keycloak_admin.assign_realm_roles(user_id=user_id, roles=[role])
                logger.info(f"Assigned '{role_name}' role to Keycloak user_id: {user_id}")
            else:
                logger.debug(f"Role '{role_name}' already assigned to Keycloak user_id: {user_id}")

        except Exception as role_e:
            logger.error(f"Failed to assign '{role_name}' role for user_id {user_id}: {str(role_e)}")
            raise HTTPException(status_code=500, detail=f"Failed to assign Keycloak role: {str(role_e)}")

        return user_id

    except Exception as e:
        logger.error(f"Failed to update Keycloak user for email {current_email}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to update Keycloak user: {str(e)}")

def delete_keycloak_user(email: str) -> None:
    """
    Delete a user from Keycloak by their email.
    """
    try:
        keycloak_admin = KeycloakAdmin(
            server_url=settings.KEYCLOAK_URL,
            username=settings.KEYCLOAK_ADMIN_USERNAME,
            password=settings.KEYCLOAK_ADMIN_PASSWORD,
            realm_name=settings.KEYCLOAK_REALM,
            client_id=settings.KEYCLOAK_CLIENT_ID,
            client_secret_key=settings.KEYCLOAK_CLIENT_SECRET,
            verify=True
        )
        logger.debug(f"Initialized Keycloak admin client for realm {settings.KEYCLOAK_REALM}")

        # Find user by email
        users = keycloak_admin.get_users(query={"email": email})
        if not users:
            logger.warning(f"Keycloak user with email {email} not found for deletion")
            return  # Silently return if user not found to avoid breaking the application
        user_id = users[0]["id"]
        logger.debug(f"Found Keycloak user_id: {user_id} for email: {email}")

        # Delete user
        keycloak_admin.delete_user(user_id=user_id)
        logger.info(f"Successfully deleted Keycloak user with email: {email}, user_id: {user_id}")

    except Exception as e:
        logger.error(f"Failed to delete Keycloak user for email {email}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to delete Keycloak user: {str(e)}")









# import logging
# import secrets
# import string
# import re
# from typing import Optional, Dict
# from uuid import uuid4
# from keycloak import KeycloakAdmin
# from fastapi import HTTPException
# from app.config import settings

# logger = logging.getLogger(__name__)

# def generate_username(first_name: str, last_name: str) -> str:
#     """
#     Generate a unique username based on first_name and last_name with a random suffix.
#     Fallback to UUID-based username if names are invalid.
#     """
#     # Clean names: remove special characters and convert to lowercase
#     clean_first = re.sub(r'[^\w\s]', '', first_name.lower()).strip() if first_name else ""
#     clean_last = re.sub(r'[^\w\s]', '', last_name.lower()).strip() if last_name else ""
    
#     if clean_first and clean_last:
#         # random_suffix = ''.join(secrets.choice(string.digits) for _ in range(4))
#         base_username = f"{clean_first}.{clean_last}"
#     else:
#         # Fallback to UUID-based username
#         base_username = f"user_{str(uuid4())[:8]}"
    
#     return base_username

# def create_keycloak_user(
#     email: str,
#     first_name: str,
#     last_name: str,
#     custom_attributes: Dict,
#     role_name: str
# ) -> str:
#     """
#     Create a user in Keycloak with a generated username, specified role, and custom attributes.
#     Returns the Keycloak user ID.
#     """
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
#         logger.debug(f"Initialized Keycloak admin client for realm {settings.KEYCLOAK_REALM}")

#         # Generate unique username
#         username = generate_username(first_name, last_name)
#         attempt = 1
#         max_attempts = 5
#         while attempt <= max_attempts:
#             # Check if username exists
#             existing_users = keycloak_admin.get_users(query={"username": username})
#             if not existing_users:
#                 break
#             # If username exists, append a new random suffix
#             random_suffix = ''.join(secrets.choice(string.digits) for _ in range(4))
#             username = f"{username.split('.')[0]}.{username.split('.')[1]}.{random_suffix}" if '.' in username else f"user_{str(uuid4())[:8]}"
#             attempt += 1
#         if attempt > max_attempts:
#             logger.error(f"Failed to generate unique username after {max_attempts} attempts")
#             raise HTTPException(status_code=500, detail="Failed to generate unique username")

#         # Generate secure random password
#         password = ''.join(secrets.choice(string.ascii_letters + string.digits) for _ in range(12))
#         user_data = {
#             "username": username,
#             "email": email,
#             "firstName": first_name,
#             "lastName": last_name,
#             "enabled": True,
#             "attributes": custom_attributes,
#             "credentials": [
#                 {
#                     "type": "password",
#                     "value": "pass",
#                     "temporary": True
#                 }
#             ]
#         }
        
#         # Create user
#         user_id = keycloak_admin.create_user(user_data, exist_ok=False)
#         logger.info(f"Created Keycloak user with username: {username}, email: {email}, user_id: {user_id}")

#         # Assign role
#         try:
#             role = keycloak_admin.get_realm_role(role_name)
#             keycloak_admin.assign_realm_roles(user_id=user_id, roles=[role])
#             logger.info(f"Assigned '{role_name}' role to Keycloak user_id: {user_id}")
#         except Exception as role_e:
#             logger.error(f"Failed to assign '{role_name}' role for username {username}: {str(role_e)}")
#             # Delete the user if role assignment fails
#             try:
#                 keycloak_admin.delete_user(user_id=user_id)
#                 logger.info(f"Deleted Keycloak user_id {user_id} due to role assignment failure")
#             except Exception as delete_e:
#                 logger.error(f"Failed to delete Keycloak user_id {user_id}: {str(delete_e)}")
#             raise HTTPException(status_code=500, detail=f"Failed to assign Keycloak role: {str(role_e)}")

#         return user_id

#     except Exception as e:
#         logger.error(f"Failed to create Keycloak user for email {email}: {str(e)}")
#         raise HTTPException(status_code=500, detail=f"Failed to create Keycloak user: {str(e)}")

# def update_keycloak_user(
#     current_email: str,
#     email: Optional[str],
#     first_name: Optional[str],
#     last_name: Optional[str],
#     custom_attributes: Optional[Dict],
#     role_name: str
# ) -> str:
#     """
#     Update a Keycloak user's details and ensure the specified role is assigned.
#     Returns the Keycloak user ID.
#     """
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
#         logger.debug(f"Initialized Keycloak admin client for realm {settings.KEYCLOAK_REALM}")

#         # Find user by current email
#         users = keycloak_admin.get_users(query={"email": current_email})
#         if not users:
#             logger.error(f"Keycloak user with email {current_email} not found")
#             raise HTTPException(status_code=404, detail=f"Keycloak user with email {current_email} not found")
#         user_id = users[0]["id"]
#         logger.debug(f"Found Keycloak user_id: {user_id} for email: {current_email}")

#         # Prepare update data
#         update_data = {}
#         if email is not None:
#             update_data["email"] = email
#         if first_name is not None:
#             update_data["firstName"] = first_name
#         if last_name is not None:
#             update_data["lastName"] = last_name
#         if custom_attributes is not None:
#             update_data["attributes"] = custom_attributes

#         # Update user details
#         if update_data:
#             try:
#                 keycloak_admin.update_user(user_id=user_id, payload=update_data)
#                 logger.info(f"Updated Keycloak user details for user_id: {user_id}, update_data: {update_data}")
#             except Exception as update_e:
#                 logger.error(f"Failed to update Keycloak user_id {user_id}: {str(update_e)}")
#                 raise HTTPException(status_code=500, detail=f"Keycloak update failed: {str(update_e)}")
#         else:
#             logger.debug(f"No user details to update for Keycloak user_id: {user_id}")

#         # Ensure the specified role is assigned
#         try:
#             # Get current roles
#             current_roles = keycloak_admin.get_realm_roles_of_user(user_id=user_id)
#             current_role_names = [role["name"] for role in current_roles]
            
#             # Check if the desired role is already assigned
#             if role_name not in current_role_names:
#                 role = keycloak_admin.get_realm_role(role_name)
#                 keycloak_admin.assign_realm_roles(user_id=user_id, roles=[role])
#                 logger.info(f"Assigned '{role_name}' role to Keycloak user_id: {user_id}")
#             else:
#                 logger.debug(f"Role '{role_name}' already assigned to Keycloak user_id: {user_id}")

#         except Exception as role_e:
#             logger.error(f"Failed to assign '{role_name}' role for user_id {user_id}: {str(role_e)}")
#             raise HTTPException(status_code=500, detail=f"Failed to assign Keycloak role: {str(role_e)}")

#         return user_id

#     except Exception as e:
#         logger.error(f"Failed to update Keycloak user for email {current_email}: {str(e)}")
#         raise HTTPException(status_code=500, detail=f"Failed to update Keycloak user: {str(e)}")