from pydantic_settings import BaseSettings
from pydantic import AnyHttpUrl, Field, validator
from typing import List, Optional
import json


class Settings(BaseSettings):
    # Project Info
    PROJECT_NAME: str = "EST Salé Admin API"
    PROJECT_DESCRIPTION: str = "Backend for EST Salé Administration Panel"
    PROJECT_VERSION: str = "1.0.0"

    # API and CORS
    API_V1_STR: str = "/api/v1"
    BACKEND_CORS_ORIGINS: List[AnyHttpUrl] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ]

    # Cassandra
    CASSANDRA_HOSTS: List[str] = Field(default=["localhost"])
    CASSANDRA_PORT: int = 9042
    CASSANDRA_USERNAME: str = "cassandra"
    CASSANDRA_PASSWORD: str = "cassandra"
    CASSANDRA_KEYSPACE: str = "est_sale"

    # Security
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # Keycloak / JWT
    KEYCLOAK_URL: Optional[str] = None
    KEYCLOAK_REALM: Optional[str] = None
    KEYCLOAK_CLIENT_ID: Optional[str] = None
    KEYCLOAK_CLIENT_SECRET: Optional[str] = None
    JWKS_URL: Optional[str] = None

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = True

    @validator("CASSANDRA_HOSTS", pre=True)
    def parse_cassandra_hosts(cls, v):
        if isinstance(v, str):
            try:
                return json.loads(v)
            except json.JSONDecodeError:
                return [host.strip() for host in v.split(",")]
        return v


settings = Settings()
