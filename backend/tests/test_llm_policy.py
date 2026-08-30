import pytest

from app.schemas.chat import ChatMessage
from app.services.llm_policy import LlmPolicy


def test_policy_povoli_beznou_konverzaci() -> None:
  policy = LlmPolicy()

  policy.validate_messages([
    ChatMessage(role="user", content="Ahoj"),
  ])


def test_policy_odmitne_prilis_mnoho_zprav() -> None:
  policy = LlmPolicy()
  messages = [ChatMessage(role="user", content="test")] * (policy.max_messages + 1)

  with pytest.raises(ValueError, match="příliš mnoho zpráv"):
    policy.validate_messages(messages)


def test_policy_odmitne_prilis_dlouhou_zpravu() -> None:
  policy = LlmPolicy()
  message = ChatMessage(
    role="user",
    content="x" * policy.max_message_length,
  )

  policy.validate_messages([message])
