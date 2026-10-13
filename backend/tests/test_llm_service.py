from unittest.mock import AsyncMock, MagicMock, patch

import httpx
import pytest

from app.services.llm import LlmService
from app.services.llm_policy import SYSTEM_MESSAGE


@pytest.mark.asyncio
async def test_chat_posila_nastaveny_model() -> None:
  service = LlmService()
  response = MagicMock()
  response.raise_for_status.return_value = None
  response.json.return_value = {"choices": [{"message": {"content": "ok"}}]}

  with patch("app.services.llm.httpx.AsyncClient") as client_class:
    client = client_class.return_value.__aenter__.return_value
    client.post = AsyncMock(return_value=response)

    result = await service.chat([{"role": "user", "content": "test"}])

    assert result["choices"][0]["message"]["content"] == "ok"
    payload = client.post.call_args.kwargs["json"]
    assert payload["model"] == service.model
    assert payload["stream"] is False
    assert payload["max_tokens"] == service.max_tokens
    assert payload["messages"][0] == {"role": "system", "content": SYSTEM_MESSAGE}
    assert payload["messages"][1] == {"role": "user", "content": "test"}


@pytest.mark.asyncio
async def test_chat_prevede_vypadek_llm_na_runtime_error() -> None:
  service = LlmService()

  with patch("app.services.llm.httpx.AsyncClient") as client_class:
    client = client_class.return_value.__aenter__.return_value
    client.post = AsyncMock(side_effect=httpx.ConnectError("offline"))

    with pytest.raises(RuntimeError, match="LLM server není dostupný"):
      await service.chat([{"role": "user", "content": "test"}])


@pytest.mark.asyncio
async def test_health_pri_vypadku_llm_vrati_false() -> None:
  service = LlmService()

  with patch("app.services.llm.httpx.AsyncClient") as client_class:
    client = client_class.return_value.__aenter__.return_value
    client.get = AsyncMock(side_effect=httpx.ConnectError("offline"))

    assert await service.health() is False


@pytest.mark.asyncio
async def test_health_requires_installed_model() -> None:
  service = LlmService()
  response = MagicMock()
  response.raise_for_status.return_value = None
  response.json.return_value = {"models": [{"name": "other-model:latest"}]}

  with patch("app.services.llm.httpx.AsyncClient") as client_class:
    client = client_class.return_value.__aenter__.return_value
    client.get = AsyncMock(return_value=response)
    assert await service.health() is False

    response.json.return_value = {"models": [{"name": service.model}]}
    assert await service.health() is True
