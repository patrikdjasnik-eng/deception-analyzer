from collections.abc import AsyncIterator
from unittest.mock import patch


async def fake_stream(_messages: list[dict[str, str]]) -> AsyncIterator[str]:
  yield '{"choices":[{"delta":{"content":"Aho"}}]}'
  yield '{"choices":[{"delta":{"content":"j"}}]}'


async def broken_stream(_messages: list[dict[str, str]]) -> AsyncIterator[str]:
  raise RuntimeError("LLM server není dostupný.")
  yield ""


def test_chat_stream_returns_sse_events(authenticated) -> None:
  client, headers = authenticated

  with patch("app.routers.ai.llm_service.chat_stream", new=fake_stream):
    response = client.post(
      "/api/ai/chat/stream",
      json={"messages": [{"role": "user", "content": "Ahoj"}]},
      headers=headers,
    )

  assert response.status_code == 200
  assert response.headers["content-type"].startswith("text/event-stream")
  assert response.text == (
    'data: {"choices":[{"delta":{"content":"Aho"}}]}\n\n'
    'data: {"choices":[{"delta":{"content":"j"}}]}\n\n'
    'data: [DONE]\n\n'
  )


def test_chat_stream_validates_messages(authenticated) -> None:
  client, headers = authenticated
  response = client.post("/api/ai/chat/stream", json={"messages": []}, headers=headers)

  assert response.status_code == 422


def test_chat_stream_reports_upstream_error(authenticated) -> None:
  client, headers = authenticated

  with patch("app.routers.ai.llm_service.chat_stream", new=broken_stream):
    response = client.post(
      "/api/ai/chat/stream",
      json={"messages": [{"role": "user", "content": "Ahoj"}]},
      headers=headers,
    )

  assert response.status_code == 200
  assert 'event: error\ndata: "LLM server není dostupný."\n\n' == response.text
