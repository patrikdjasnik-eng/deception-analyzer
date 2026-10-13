from collections.abc import AsyncIterator
from typing import Any

import httpx

from app.config import get_settings
from app.services.llm_policy import SYSTEM_MESSAGE


class LlmService:
  def __init__(self) -> None:
    settings = get_settings()
    self.base_url = settings.llm_base_url
    self.model = settings.llm_model
    self.timeout = settings.llm_timeout_seconds
    self.max_tokens = settings.llm_max_output_tokens

  def _payload(self, messages: list[dict[str, str]], stream: bool) -> dict[str, Any]:
    return {
      "model": self.model,
      "messages": [{"role": "system", "content": SYSTEM_MESSAGE}, *messages],
      "stream": stream,
      "max_tokens": self.max_tokens,
    }

  async def health(self) -> bool:
    try:
      async with httpx.AsyncClient(timeout=10) as client:
        response = await client.get(f"{self.base_url}/api/tags")
        response.raise_for_status()
        return True
    except httpx.HTTPError:
      return False

  async def chat(self, messages: list[dict[str, str]]) -> dict[str, Any]:
    try:
      async with httpx.AsyncClient(timeout=self.timeout) as client:
        response = await client.post(
          f"{self.base_url}/v1/chat/completions",
          json=self._payload(messages, stream=False),
        )
        response.raise_for_status()
        return response.json()
    except (httpx.HTTPError, ValueError) as error:
      raise RuntimeError("LLM server není dostupný nebo vrátil neplatná data.") from error

  async def chat_stream(self, messages: list[dict[str, str]]) -> AsyncIterator[str]:
    try:
      async with httpx.AsyncClient(timeout=self.timeout) as client:
        async with client.stream(
          "POST",
          f"{self.base_url}/v1/chat/completions",
          json=self._payload(messages, stream=True),
        ) as response:
          response.raise_for_status()

          async for line in response.aiter_lines():
            if line.startswith("data: "):
              data = line[6:]

              if data == "[DONE]":
                break

              yield data
    except httpx.HTTPError as error:
      raise RuntimeError("LLM server není dostupný.") from error
