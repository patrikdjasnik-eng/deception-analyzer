from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from app.routers.ai import router as ai_router
from app.routers.auth import router as auth_router


class HealthResponse(BaseModel):
  status: str


app = FastAPI(title="RabbitHollow API", version="0.2.0")

app.add_middleware(
  CORSMiddleware,
  allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
  allow_credentials=True,
  allow_methods=["GET", "POST"],
  allow_headers=["Content-Type", "X-CSRF-Token"],
)

app.include_router(auth_router)
app.include_router(ai_router)


@app.get("/health", response_model=HealthResponse)
async def health() -> HealthResponse:
  return HealthResponse(status="ok")
