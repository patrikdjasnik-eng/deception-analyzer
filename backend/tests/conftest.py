import pytest
from fastapi.testclient import TestClient

from app.config import get_settings
from app.main import app
from app.routers.ai import chat_limiter
from app.routers.auth import login_limiter


TEST_HASH = "$argon2id$v=19$m=1024,t=1,p=1$al2D5JxYAaiknyGYviteNA$0ATebI7hwyGYBB7twCV13DPgqVDqsIh/gYOaT93mqs0"


@pytest.fixture(autouse=True)
def configure_local_test_auth(monkeypatch: pytest.MonkeyPatch):
  monkeypatch.setenv("RABBITHOLLOW_ADMIN_PASSWORD_HASH", TEST_HASH)
  monkeypatch.setenv("RABBITHOLLOW_SESSION_SECRET", "test-only-signing-key-that-is-long-enough-123456")
  get_settings.cache_clear()
  chat_limiter.buckets.clear()
  login_limiter.buckets.clear()
  yield
  get_settings.cache_clear()


@pytest.fixture
def client():
  with TestClient(app) as test_client:
    yield test_client


@pytest.fixture
def authenticated(client: TestClient):
  response = client.post("/api/auth/login", json={"password": "rabbit-test-password"})
  assert response.status_code == 200
  return client, {"X-CSRF-Token": response.json()["csrfToken"]}
