from unittest.mock import AsyncMock, patch

from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_chat_validates_messages() -> None:
  response = client.post("/api/ai/chat", json={"messages": []})

  assert response.status_code == 422


def test_chat_returns_llm_content() -> None:
  llm_response = {
    "choices": [
      {
        "message": {
          "content": "Testovací odpověď",
        },
      },
    ],
  }

  with patch(
    "app.routers.ai.llm_service.chat",
    new=AsyncMock(return_value=llm_response),
  ):
    response = client.post(
      "/api/ai/chat",
      json={"messages": [{"role": "user", "content": "Ahoj"}]},
    )

  assert response.status_code == 200
  assert response.json() == {"content": "Testovací odpověď"}


def test_chat_handles_unavailable_llm() -> None:
  with patch(
    "app.routers.ai.llm_service.chat",
    new=AsyncMock(side_effect=RuntimeError("LLM server není dostupný.")),
  ):
    response = client.post(
      "/api/ai/chat",
      json={"messages": [{"role": "user", "content": "Ahoj"}]},
    )

  assert response.status_code == 503
