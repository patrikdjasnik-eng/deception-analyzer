from app.config import get_settings
from app.schemas.chat import ChatMessage


class LlmPolicy:
  def __init__(self) -> None:
    settings = get_settings()
    self.max_messages = settings.llm_max_messages
    self.max_message_length = settings.llm_max_message_length

  def validate_messages(self, messages: list[ChatMessage]) -> None:
    if not messages:
      raise ValueError("Konverzace nesmí být prázdná.")

    if len(messages) > self.max_messages:
      raise ValueError("Konverzace obsahuje příliš mnoho zpráv.")

    if any(len(message.content) > self.max_message_length for message in messages):
      raise ValueError("Zpráva je příliš dlouhá.")
