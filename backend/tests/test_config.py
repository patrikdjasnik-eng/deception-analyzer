import pytest
from pydantic import ValidationError

from app.config import Settings, get_settings


def test_ollama_is_default_provider() -> None:
  settings = get_settings()
  assert settings.llm_base_url == "http://127.0.0.1:11434"
  assert settings.llm_model == "qwen2.5-coder:7b"


def test_llm_rejects_remote_endpoint() -> None:
  with pytest.raises(ValidationError):
    Settings(llm_base_url="http://192.0.2.10:11434")


def test_auth_configuration_requires_long_secret() -> None:
  settings = Settings(session_secret="short")
  assert not settings.auth_ready


def test_llm_url_rejects_embedded_credentials() -> None:
  with pytest.raises(ValidationError):
    Settings(llm_base_url="http://admin:password@127.0.0.1:11434")
