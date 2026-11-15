from functools import lru_cache
from urllib.parse import urlparse

from pydantic import Field, SecretStr, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
  model_config = SettingsConfigDict(
    env_prefix="RABBITHOLLOW_",
    env_file=".env",
    extra="ignore",
  )

  app_name: str = "RabbitHollow API"
  app_version: str = "0.2.0"
  admin_password_hash: SecretStr | None = None
  session_secret: SecretStr | None = None
  session_cookie_secure: bool = False
  session_max_age_seconds: int = Field(default=3600, ge=300, le=86400)
  llm_base_url: str = "http://127.0.0.1:11434"
  llm_model: str = "qwen2.5-coder:7b"
  llm_timeout_seconds: float = Field(default=120, gt=0, le=600)
  llm_max_messages: int = Field(default=50, gt=0, le=100)
  llm_max_message_length: int = Field(default=12000, gt=0, le=50000)
  llm_max_total_length: int = Field(default=32000, ge=1000, le=200000)
  llm_max_output_tokens: int = Field(default=1024, ge=64, le=4096)

  @field_validator("llm_base_url")
  @classmethod
  def validate_llm_url(cls, value: str) -> str:
    parsed = urlparse(value)

    if parsed.scheme != "http" or parsed.hostname not in {"localhost", "127.0.0.1", "::1"}:
      raise ValueError("LLM endpoint must use loopback HTTP.")

    if parsed.username or parsed.password or parsed.path not in {"", "/"} or parsed.query or parsed.fragment:
      raise ValueError("LLM endpoint must be a local origin without credentials or path.")

    return value.rstrip("/")

  @property
  def auth_ready(self) -> bool:
    password_hash = self.admin_password_hash.get_secret_value() if self.admin_password_hash else ""
    signing_secret = self.session_secret.get_secret_value() if self.session_secret else ""
    return password_hash.startswith("$argon2id$") and len(signing_secret) >= 32


@lru_cache
def get_settings() -> Settings:
  return Settings()
