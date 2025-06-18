


import logging
import os
from pathlib import Path
from pydantic_settings import BaseSettings
from typing import List, Optional
import json

# Set up logging to debug environment variable loading
logging.basicConfig(level=logging.DEBUG, filename='app.log')
logger = logging.getLogger(__name__)

class Settings(BaseSettings):
    API_V1_STR: str
    CASSANDRA_HOSTS: List[str]
    CASSANDRA_PORT: int
    CASSANDRA_KEYSPACE: str
    CASSANDRA_DC: str
    CASSANDRA_USERNAME: str
    CASSANDRA_PASSWORD: str
    KEYCLOAK_URL: str
    KEYCLOAK_INTERNAL_URL: str
    KEYCLOAK_REALM: str
    KEYCLOAK_CLIENT_ID: str
    KEYCLOAK_CLIENT_SECRET: str
    KEYCLOAK_ADMIN_USERNAME: str
    KEYCLOAK_ADMIN_PASSWORD: str
    JWKS_URL: str
    CALLBACK_URI: str
    SECRET_KEY: Optional[str] = None
    ALGORITHM: str
    CQLENG_ALLOW_SCHEMA_MANAGEMENT: bool
    AUTH_SERVICE_URL: str
    FASTAPI_HOST: str
    FASTAPI_PORT: int
    FASTAPI_RELOAD: bool

    # Parse CASSANDRA_HOSTS from JSON string env var
    @classmethod
    def _parse_hosts(cls, v):
        if isinstance(v, str):
            return json.loads(v)
        return v

    # Validator for CASSANDRA_HOSTS
    @classmethod
    def parse_cassandra_hosts(cls, v):
        return cls._parse_hosts(v)

    class Config:
        env_file = Path(__file__).parent.parent / ".env"  # Points to backend/.env
        env_file_encoding = "utf-8"
        extra = "ignore"

    def __init__(self):
        super().__init__()
        # Log all settings and raw environment variables for debugging
        logger.debug(f"Using .env file: {self.Config.env_file}")
        logger.debug(f"Loaded settings: {self.dict()}")
        logger.debug(f"KEYCLOAK_ADMIN_USERNAME: {self.KEYCLOAK_ADMIN_USERNAME}")
        logger.debug(f"KEYCLOAK_ADMIN_PASSWORD: {self.KEYCLOAK_ADMIN_PASSWORD}")
        logger.debug(f"Raw env KEYCLOAK_ADMIN_USERNAME: {os.getenv('KEYCLOAK_ADMIN_USERNAME')}")
        logger.debug(f"Raw env KEYCLOAK_ADMIN_PASSWORD: {os.getenv('KEYCLOAK_ADMIN_PASSWORD')}")

# Instantiate settings
settings = Settings()
logger.info(f"Settings initialized: KEYCLOAK_ADMIN_USERNAME={settings.KEYCLOAK_ADMIN_USERNAME}, KEYCLOAK_ADMIN_PASSWORD={settings.KEYCLOAK_ADMIN_PASSWORD}")