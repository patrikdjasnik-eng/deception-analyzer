import json

from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import StreamingResponse

from app.rate_limit import RateLimiter
from app.schemas.chat import ChatRequest, ChatResponse
from app.security import Session, require_csrf, require_session
from app.services.llm import LlmService
from app.services.llm_policy import LlmPolicy


router = APIRouter(prefix="/api/ai", tags=["ai"])
llm_service = LlmService()
chat_limiter = RateLimiter(limit=12, window_seconds=60)


async def _authorize_chat(request: Request, session: Session = Depends(require_csrf)) -> None:
  if not await chat_limiter.allow(session.csrf_token):
    raise HTTPException(status_code=429, detail="AI request limit exceeded.")


def _validated_messages(request: ChatRequest) -> list[dict[str, str]]:
  try:
    LlmPolicy().validate_messages(request.messages)
  except ValueError as error:
    raise HTTPException(status_code=422, detail=str(error)) from error

  return [message.model_dump() for message in request.messages]


@router.get("/health")
async def ai_health(_session: Session = Depends(require_session)) -> dict[str, bool]:
  return {"available": await llm_service.health()}


@router.post("/chat", response_model=ChatResponse, dependencies=[Depends(_authorize_chat)])
async def chat(request: ChatRequest) -> ChatResponse:
  messages = _validated_messages(request)

  try:
    result = await llm_service.chat(messages)
    content = result["choices"][0]["message"]["content"]

    if not isinstance(content, str):
      raise TypeError("Missing content.")

    return ChatResponse(content=content)
  except (KeyError, IndexError, TypeError) as error:
    raise HTTPException(
      status_code=502,
      detail="LLM server vrátil neočekávanou odpověď.",
    ) from error
  except RuntimeError as error:
    raise HTTPException(status_code=503, detail=str(error)) from error


@router.post("/chat/stream", dependencies=[Depends(_authorize_chat)])
async def chat_stream(request: ChatRequest) -> StreamingResponse:
  messages = _validated_messages(request)

  async def generate():
    try:
      async for chunk in llm_service.chat_stream(messages):
        yield f"data: {chunk}\n\n"

      yield "data: [DONE]\n\n"
    except RuntimeError as error:
      yield f"event: error\ndata: {json.dumps(str(error), ensure_ascii=False)}\n\n"

  return StreamingResponse(
    generate(),
    media_type="text/event-stream",
    headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
  )
