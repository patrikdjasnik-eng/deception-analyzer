from typing import Literal

from pydantic import BaseModel, Field, field_validator


class ChatMessage(BaseModel):
  role: Literal["user", "assistant"]
  content: str = Field(min_length=1, max_length=12000)

  @field_validator("content")
  @classmethod
  def validate_content(cls, value: str) -> str:
    content = value.strip()

    if not content:
      raise ValueError("Zpráva nesmí obsahovat pouze mezery.")

    return content


class ChatRequest(BaseModel):
  messages: list[ChatMessage] = Field(min_length=1, max_length=50)


class ChatResponse(BaseModel):
  content: str
