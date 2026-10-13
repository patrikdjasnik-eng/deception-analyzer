import secrets
from dataclasses import dataclass

from argon2 import PasswordHasher
from argon2.exceptions import InvalidHashError, VerificationError, VerifyMismatchError
from fastapi import Depends, HTTPException, Request, Response
from itsdangerous import BadSignature, SignatureExpired, URLSafeTimedSerializer

from app.config import get_settings


COOKIE_NAME = "rh_session"
_password_hasher = PasswordHasher()


@dataclass(frozen=True)
class Session:
  subject: str
  csrf_token: str


def _serializer() -> URLSafeTimedSerializer:
  settings = get_settings()

  if not settings.auth_ready or settings.session_secret is None:
    raise HTTPException(status_code=503, detail="Authentication is not configured.")

  return URLSafeTimedSerializer(settings.session_secret.get_secret_value(), salt="rabbithollow-session-v1")


def verify_admin_password(password: str) -> bool:
  settings = get_settings()

  if not settings.auth_ready or settings.admin_password_hash is None:
    raise HTTPException(status_code=503, detail="Authentication is not configured.")

  try:
    return _password_hasher.verify(settings.admin_password_hash.get_secret_value(), password)
  except (VerifyMismatchError, VerificationError, InvalidHashError):
    return False


def set_session_cookie(response: Response) -> Session:
  settings = get_settings()
  session = Session(subject="local-admin", csrf_token=secrets.token_urlsafe(32))
  token = _serializer().dumps({"sub": session.subject, "csrf": session.csrf_token})
  response.set_cookie(
    key=COOKIE_NAME,
    value=token,
    max_age=settings.session_max_age_seconds,
    httponly=True,
    secure=settings.session_cookie_secure,
    samesite="strict",
    path="/api",
  )
  return session


async def require_session(request: Request) -> Session:
  token = request.cookies.get(COOKIE_NAME)

  if not token:
    raise HTTPException(status_code=401, detail="Authentication required.")

  settings = get_settings()

  try:
    payload = _serializer().loads(token, max_age=settings.session_max_age_seconds)
  except (BadSignature, SignatureExpired) as error:
    raise HTTPException(status_code=401, detail="Invalid or expired session.") from error

  if not isinstance(payload, dict) or payload.get("sub") != "local-admin":
    raise HTTPException(status_code=401, detail="Invalid session.")

  csrf = payload.get("csrf")

  if not isinstance(csrf, str) or len(csrf) < 32:
    raise HTTPException(status_code=401, detail="Invalid session.")

  return Session(subject="local-admin", csrf_token=csrf)


async def require_csrf(request: Request, session: Session = Depends(require_session)) -> Session:
  provided = request.headers.get("X-CSRF-Token", "")

  if not provided or not secrets.compare_digest(provided, session.csrf_token):
    raise HTTPException(status_code=403, detail="Invalid CSRF token.")

  origin = request.headers.get("origin")

  if origin and origin not in {
    "http://127.0.0.1:5173",
    "http://localhost:5173",
    "http://127.0.0.1:8000",
    "http://localhost:8000",
  }:
    raise HTTPException(status_code=403, detail="Origin is not permitted.")

  return session
