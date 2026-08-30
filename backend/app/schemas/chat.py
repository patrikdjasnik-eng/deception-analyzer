from pydantic import BaseModel, Field


class ChatMessage(BaseModel):
  role: str = Field(pattern="^(user|assistant|system)$")
  content: str = Field(min_length=1, max_length=12000)


class ChatRequest(BaseModel):
  messages: list[ChatMessage] = Field(min_length=1, max_length=50)


class ChatResponse(BaseModel):
  content: str
