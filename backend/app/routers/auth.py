from fastapi import APIRouter, Depends, HTTPException, Request, Response
from pydantic import BaseModel, Field

from app.rate_limit import RateLimiter
from app.security import COOKIE_NAME, Session, require_csrf, require_session, set_session_cookie, verify_admin_password


router = APIRouter(prefix="/api/auth", tags=["auth"])
login_limiter = RateLimiter(limit=5, window_seconds=60)


class LoginRequest(BaseModel):
  password: str = Field(min_length=1, max_length=200)


class SessionResponse(BaseModel):
  authenticated: bool
  csrfToken: str


@router.post("/login", response_model=SessionResponse)
async def login(payload: LoginRequest, request: Request, response: Response) -> SessionResponse:
  source = request.client.host if request.client else "unknown"

  if not await login_limiter.allow(source):
    raise HTTPException(status_code=429, detail="Too many login attempts.")

  if not verify_admin_password(payload.password):
    raise HTTPException(status_code=401, detail="Invalid credentials.")

  session = set_session_cookie(response)
  return SessionResponse(authenticated=True, csrfToken=session.csrf_token)


@router.get("/me", response_model=SessionResponse)
async def me(session: Session = Depends(require_session)) -> SessionResponse:
  return SessionResponse(authenticated=True, csrfToken=session.csrf_token)


@router.post("/logout")
async def logout(response: Response, _session: Session = Depends(require_csrf)) -> dict[str, bool]:
  response.delete_cookie(COOKIE_NAME, path="/api")
  return {"ok": True}
