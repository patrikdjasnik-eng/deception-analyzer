import pytest
from pydantic import ValidationError

from app.schemas.chat import ChatRequest


def test_chat_request_odrizne_okrajove_mezery() -> None:
  request = ChatRequest(messages=[{"role": "user", "content": "  ahoj  "}])

  assert request.messages[0].content == "ahoj"


def test_chat_request_odmitne_prazdnou_zpravu() -> None:
  with pytest.raises(ValidationError):
    ChatRequest(messages=[{"role": "user", "content": "   "}])


def test_chat_request_odmitne_neplatnou_roli() -> None:
  with pytest.raises(ValidationError):
    ChatRequest(messages=[{"role": "developer", "content": "test"}])


def test_chat_request_odmitne_prilis_dlouhou_zpravu() -> None:
  with pytest.raises(ValidationError):
    ChatRequest(messages=[{"role": "user", "content": "x" * 12001}])
