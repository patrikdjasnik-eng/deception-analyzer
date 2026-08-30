import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';

import { Chat } from './components/Chat/Chat';
import { Dashboard } from './components/Dashboard/Dashboard';
import { Shell } from './components/Shell/Shell';
import './styles.css';

function App() {
  const [showChat, setShowChat] = useState(false);

  return (
    <Shell>
      {showChat ? (
        <div className="content-view">
          <button className="view-back" type="button" onClick={() => setShowChat(false)}>
            ← Overview
          </button>
          <Chat />
        </div>
      ) : (
        <div className="content-view">
          <Dashboard />
          <button className="floating-ai" type="button" onClick={() => setShowChat(true)} aria-label="Open AI Analyst">
            ✦ AI
          </button>
        </div>
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
    <App />
  </StrictMode>,
);
