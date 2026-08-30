import json

from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse

from app.schemas.chat import ChatRequest, ChatResponse
from app.services.llm import LlmService


router = APIRouter(prefix="/api/ai", tags=["ai"])
llm_service = LlmService()


@router.get("/health")
async def ai_health() -> dict[str, bool]:
  return {"available": await llm_service.health()}


@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest) -> ChatResponse:
  try:
    result = await llm_service.chat([
      message.model_dump() for message in request.messages
    ])
    content = result["choices"][0]["message"]["content"]
    return ChatResponse(content=content)
  except (KeyError, IndexError, TypeError) as error:
    raise HTTPException(
      status_code=502,
      detail="LLM server vrátil neočekávanou odpověď.",
    ) from error
  except RuntimeError as error:
    raise HTTPException(status_code=503, detail=str(error)) from error


@router.post("/chat/stream")
async def chat_stream(request: ChatRequest) -> StreamingResponse:
  messages = [message.model_dump() for message in request.messages]

  async def generate():
    try:
      async for chunk in llm_service.chat_stream(messages):
        yield f"data: {chunk}\n\n"
      yield "data: [DONE]\n\n"
    except RuntimeError as error:
      yield f"event: error\ndata: {json.dumps(str(error))}\n\n"

  return StreamingResponse(
    generate(),
    media_type="text/event-stream",
    headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
  )
