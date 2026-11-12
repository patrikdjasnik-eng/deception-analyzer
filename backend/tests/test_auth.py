from fastapi.testclient import TestClient

from app.config import get_settings


def test_login_rejects_invalid_password(client: TestClient) -> None:
  response = client.post("/api/auth/login", json={"password": "incorrect"})

  assert response.status_code == 401


def test_login_and_session_cookie(authenticated) -> None:
  client, headers = authenticated
  response = client.get("/api/auth/me")

  assert response.status_code == 200
  assert response.json() == {"authenticated": True, "csrfToken": headers["X-CSRF-Token"]}
  assert "rh_session" in client.cookies


def test_logout_requires_csrf_and_clears_session(authenticated) -> None:
  client, headers = authenticated

  assert client.post("/api/auth/logout").status_code == 403
  assert client.post("/api/auth/logout", headers=headers).status_code == 200
  assert client.get("/api/auth/me").status_code == 401


def test_reject_foreign_origin(authenticated) -> None:
  client, headers = authenticated
  response = client.post(
    "/api/ai/chat",
    json={"messages": [{"role": "user", "content": "hello"}]},
    headers={**headers, "Origin": "https://untrusted.invalid"},
  )

  assert response.status_code == 403


def test_auth_fails_closed_without_secrets(client: TestClient, monkeypatch) -> None:
  monkeypatch.delenv("RABBITHOLLOW_ADMIN_PASSWORD_HASH")
  monkeypatch.delenv("RABBITHOLLOW_SESSION_SECRET")
  get_settings.cache_clear()

  response = client.post("/api/auth/login", json={"password": "any-password"})
  assert response.status_code == 503


def test_login_attempts_are_rate_limited(client: TestClient) -> None:
  statuses = [
    client.post("/api/auth/login", json={"password": "incorrect"}).status_code
    for _ in range(6)
  ]
  assert statuses == [401] * 5 + [429]
