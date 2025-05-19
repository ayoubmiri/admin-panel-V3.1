from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    CASSANDRA_HOSTS: List[str]
    CASSANDRA_PORT: int = 9042
    CASSANDRA_KEYSPACE: str = "est_sale"
    
    KEYCLOAK_URL: str = "http://keycloak:8080"
    KEYCLOAK_REALM: str = "ent-realm"
    KEYCLOAK_CLIENT_ID: str = "ent-client"
    KEYCLOAK_CLIENT_SECRET: str = ""

    class Config:
        env_file = ".env"  # reads environment variables from .env file

settings = Settings()
