from collections.abc import AsyncIterator
from typing import Any

import httpx

from app.config import get_settings


class LlmService:
  def __init__(self) -> None:
    settings = get_settings()
    self.base_url = settings.llm_base_url.rstrip("/")
    self.timeout = settings.llm_timeout_seconds

  async def health(self) -> bool:
    try:
      async with httpx.AsyncClient(timeout=self.timeout) as client:
        response = await client.get(f"{self.base_url}/health")
        response.raise_for_status()
        return True
    except (httpx.HTTPError, httpx.TimeoutException):
      return False

  async def chat(self, messages: list[dict[str, str]]) -> dict[str, Any]:
    payload = {"messages": messages, "stream": False}

    try:
      async with httpx.AsyncClient(timeout=self.timeout) as client:
        response = await client.post(
          f"{self.base_url}/v1/chat/completions",
          json=payload,
        )
        response.raise_for_status()
        return response.json()
    except (httpx.HTTPError, httpx.TimeoutException) as error:
      raise RuntimeError("LLM server není dostupný.") from error

  async def chat_stream(
    self,
    messages: list[dict[str, str]],
  ) -> AsyncIterator[str]:
    payload = {"messages": messages, "stream": True}

    try:
      async with httpx.AsyncClient(timeout=self.timeout) as client:
        async with client.stream(
          "POST",
          f"{self.base_url}/v1/chat/completions",
          json=payload,
        ) as response:
          response.raise_for_status()
          async for line in response.aiter_lines():
            if line.startswith("data: "):
              data = line[6:]
              if data == "[DONE]":
                break
              yield data
    except (httpx.HTTPError, httpx.TimeoutException) as error:
      raise RuntimeError("LLM server není dostupný.") from error
