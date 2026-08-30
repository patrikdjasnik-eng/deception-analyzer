from functools import lru_cache

from pydantic import BaseModel, Field


class Settings(BaseModel):
  app_name: str = "RabbitHollow API"
  app_version: str = "0.1.0"
  llm_base_url: str = Field(default="http://127.0.0.1:8080")
  llm_timeout_seconds: float = Field(default=120, gt=0)


@lru_cache
def get_settings() -> Settings:
  return Settings()
