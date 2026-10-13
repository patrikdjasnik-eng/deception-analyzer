export interface AuthSession {
  authenticated: boolean;
  csrfToken: string;
}

const localApiUrl = window.location.hostname === 'localhost'
  ? 'http://localhost:8000'
  : 'http://127.0.0.1:8000';
const apiBaseUrl = import.meta.env.VITE_API_URL ?? localApiUrl;

async function parseError(response: Response): Promise<string> {
  try {
    const payload = (await response.json()) as { detail?: string };
    return payload.detail ?? 'Požadavek selhal.';
  } catch {
    return 'Požadavek selhal.';
  }
}

export async function getSession(): Promise<AuthSession | null> {
  const response = await fetch(apiBaseUrl + '/api/auth/me', {
    credentials: 'include',
  });

  if (response.status === 401 || response.status === 503) {
    return null;
  }

  if (!response.ok) throw new Error(await parseError(response));
  return (await response.json()) as AuthSession;
}

export async function login(password: string): Promise<AuthSession> {
  const response = await fetch(apiBaseUrl + '/api/auth/login', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  });

  if (!response.ok) throw new Error(await parseError(response));
  return (await response.json()) as AuthSession;
}

export async function logout(csrfToken: string): Promise<void> {
  const response = await fetch(apiBaseUrl + '/api/auth/logout', {
    method: 'POST',
    credentials: 'include',
    headers: { 'X-CSRF-Token': csrfToken },
  });

  if (!response.ok) throw new Error(await parseError(response));
}
