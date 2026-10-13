import { useCallback, useEffect, useState, type FormEvent, type ReactNode } from 'react';

import { getSession, login, logout } from '../../services/auth';

type AuthGateProps = {
  children: (csrfToken: string, onLogout: () => void) => ReactNode;
};

export function AuthGate({ children }: AuthGateProps) {
  const [csrfToken, setCsrfToken] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;

    void getSession()
      .then((session) => {
        if (active) setCsrfToken(session?.csrfToken ?? null);
      })
      .catch(() => {
        if (active) setCsrfToken(null);
      })
      .finally(() => {
        if (active) setChecking(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const handleLogin = useCallback(async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const session = await login(password);
      setPassword('');
      setCsrfToken(session.csrfToken);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Přihlášení selhalo.');
    } finally {
      setLoading(false);
    }
  }, [password]);

  const handleLogout = useCallback(() => {
    if (!csrfToken) return;

    void logout(csrfToken)
      .then(() => {
        setCsrfToken(null);
        setError(null);
      })
      .catch((requestError: unknown) => {
        setError(requestError instanceof Error ? requestError.message : 'Odhlášení selhalo.');
      });
  }, [csrfToken]);

  if (checking) {
    return <main className="auth-gate" aria-live="polite">Kontroluji lokální relaci…</main>;
  }

  if (csrfToken) {
    return <>{children(csrfToken, handleLogout)}</>;
  }

  return (
    <main className="auth-gate">
      <form className="auth-panel" onSubmit={(event) => void handleLogin(event)}>
        <div className="eyebrow">RABBITHOLLOW SECURITY</div>
        <h1>Lokální přihlášení</h1>
        <p>AI API je chráněné. Pro první spuštění nastav heslo a session secret v backend/.env.</p>
        <label htmlFor="admin-password">Heslo správce</label>
        <input
          id="admin-password"
          type="password"
          autoComplete="current-password"
          value={password}
          minLength={1}
          maxLength={200}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
        <button className="primary-action" type="submit" disabled={loading || !password}>
          {loading ? 'Přihlašuji…' : 'Přihlásit'}
        </button>
        {error && <p className="chatError" role="alert">{error}</p>}
      </form>
    </main>
  );
}
