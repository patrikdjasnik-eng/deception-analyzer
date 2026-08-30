from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from app.routers.ai import router as ai_router


class HealthResponse(BaseModel):
  status: str


app = FastAPI(title="RabbitHollow API", version="0.1.0")

app.add_middleware(
  CORSMiddleware,
  allow_origins=["http://localhost:5173"],
  allow_credentials=True,
  allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE"],
  allow_headers=["*"],
)

app.include_router(ai_router)


@app.get("/health", response_model=HealthResponse)
async def health() -> HealthResponse:
  return HealthResponse(status="ok")
