from fastapi import APIRouter, HTTPException

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
