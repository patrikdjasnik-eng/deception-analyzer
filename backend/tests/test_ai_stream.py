from collections.abc import AsyncIterator
from unittest.mock import patch

from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


async def fake_stream(_messages: list[dict[str, str]]) -> AsyncIterator[str]:
  yield '{"choices":[{"delta":{"content":"Aho"}}]}'
  yield '{"choices":[{"delta":{"content":"j"}}]}'


def test_chat_stream_returns_sse_events() -> None:
  with patch("app.routers.ai.llm_service.chat_stream", new=fake_stream):
    response = client.post(
      "/api/ai/chat/stream",
      json={"messages": [{"role": "user", "content": "Ahoj"}]},
    )

  assert response.status_code == 200
  assert response.headers["content-type"].startswith("text/event-stream")
  assert response.text == (
    'data: {"choices":[{"delta":{"content":"Aho"}}]}\n\n'
    'data: {"choices":[{"delta":{"content":"j"}}]}\n\n'
    'data: [DONE]\n\n'
  )


def test_chat_stream_validates_messages() -> None:
  response = client.post(
    "/api/ai/chat/stream",
    json={"messages": []},
  )

  assert response.status_code == 422
