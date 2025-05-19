from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    CASSANDRA_HOSTS: List[str]
    CASSANDRA_PORT: int = 9042
    CASSANDRA_KEYSPACE: str = "est_sale"
    
    KEYCLOAK_URL: str = "http://localhost:8080"
    KEYCLOAK_REALM: str = "ent_est-realm"
    KEYCLOAK_CLIENT_ID: str = "ent_est-client"
    KEYCLOAK_CLIENT_SECRET: str = ""
    JWKS_URL: str = "http://localhost:8080/realms/ent_est-realm/protocol/openid-connect/certs"

    class Config:
        env_file = ".env"  # reads environment variables from .env file

settings = Settings()
