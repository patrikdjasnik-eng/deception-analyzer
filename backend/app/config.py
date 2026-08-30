from functools import lru_cache

from pydantic import BaseModel, Field


class Settings(BaseModel):
  app_name: str = "RabbitHollow API"
  app_version: str = "0.1.0"
  llm_base_url: str = Field(default="http://127.0.0.1:8080")
  llm_model: str = Field(default="qwen2.5-coder-7b")
  llm_timeout_seconds: float = Field(default=120, gt=0, le=600)
  llm_max_messages: int = Field(default=50, gt=0, le=100)
  llm_max_message_length: int = Field(default=12000, gt=0, le=50000)


@lru_cache
def get_settings() -> Settings:
  return Settings()
