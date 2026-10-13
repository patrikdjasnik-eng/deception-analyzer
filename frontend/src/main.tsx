import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';

import { AuthGate } from './components/Auth/AuthGate';
import { Chat } from './components/Chat/Chat';
import { Dashboard } from './components/Dashboard/Dashboard';
import { Shell } from './components/Shell/Shell';
import { Workspace, type WorkspaceView } from './components/Workspace/Workspace';
import './styles.css';

type AppProps = {
  csrfToken: string;
  onLogout: () => void;
};

function App({ csrfToken, onLogout }: AppProps) {
  const [activeView, setActiveView] = useState<WorkspaceView>('Overview');
  const [showChat, setShowChat] = useState(false);

  const handleNavigate = (view: WorkspaceView) => {
    setActiveView(view);
    setShowChat(view === 'AI Analyst');
  };

  return (
    <Shell onNavigate={handleNavigate} onLogout={onLogout}>
      {showChat ? (
        <div className="content-view">
          <button className="view-back" type="button" onClick={() => handleNavigate('Overview')}>
            ← Overview
          </button>
          <Chat csrfToken={csrfToken} />
        </div>
      ) : activeView === 'Overview' ? (
        <div className="content-view">
          <Dashboard />
          <button className="floating-ai" type="button" onClick={() => handleNavigate('AI Analyst')} aria-label="Open AI Analyst">
            ✦ AI
          </button>
        </div>
      ) : (
        <Workspace view={activeView} />
      )}
    </Shell>
  );
}

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element nebyl nalezen.');
}

createRoot(rootElement).render(
  <StrictMode>
    <AuthGate>
      {(csrfToken, onLogout) => <App csrfToken={csrfToken} onLogout={onLogout} />}
    </AuthGate>
  </StrictMode>,
);
