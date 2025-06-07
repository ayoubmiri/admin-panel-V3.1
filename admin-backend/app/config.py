# from pydantic_settings import BaseSettings
# from typing import List


# class Settings(BaseSettings):
#     API_V1_STR: str = "/api/v1"
#     CASSANDRA_HOSTS: List[str]
#     CASSANDRA_PORT: int = 9042
#     CASSANDRA_KEYSPACE: str = "est_sale"
#     CASSANDRA_DC: str = "dC2"
#     KEYCLOAK_URL: str = "http://localhost:8080"
#     KEYCLOAK_REALM: str = "ent_est-realm"
#     KEYCLOAK_CLIENT_ID: str = "ent_est-client"
#     KEYCLOAK_CLIENT_SECRET: str = ""
#     JWKS_URL: str = "http://localhost:8080/realms/ent_est-realm/protocol/openid-connect/certs"
#     cqleng_allow_schema_management: bool = True

#     class Config:
#         env_file = ".env"  # reads environment variables from .env file

# settings = Settings()

from pydantic_settings import BaseSettings
from typing import List, Optional
import json

class Settings(BaseSettings):
    API_V1_STR: str
    CASSANDRA_HOSTS: List[str]
    CASSANDRA_PORT: int
    CASSANDRA_KEYSPACE: str
    CASSANDRA_DC: str
    CASSANDRA_USERNAME: str
    CASSANDRA_PASSWORD: str
    KEYCLOAK_URL: str
    KEYCLOAK_REALM: str
    KEYCLOAK_CLIENT_ID: str
    KEYCLOAK_CLIENT_SECRET: str
    KEYCLOAK_ADMIN_USER: str
    KEYCLOAK_ADMIN_PASSWORD: str
    JWKS_URL: str
    CQLENG_ALLOW_SCHEMA_MANAGEMENT: bool
    SECRET_KEY: Optional[str] = None  # Make optional for RS256
    ALGORITHM: str
    ##################
    CALLBACK_URI: str

    # Parse CASSANDRA_HOSTS from JSON string env var
    @classmethod
    def _parse_hosts(cls, v):
        if isinstance(v, str):
            return json.loads(v)
        return v

    # Validator for CASSANDRA_HOSTS
    from pydantic import validator
    @validator("CASSANDRA_HOSTS", pre=True)
    def parse_cassandra_hosts(cls, v):
        return cls._parse_hosts(v)

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        extra = "ignore"

settings = Settings()
