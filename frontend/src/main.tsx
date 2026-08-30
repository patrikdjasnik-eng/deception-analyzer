import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { Chat } from './components/Chat/Chat';
import './styles.css';

function App() {
  return (
    <main className="app">
      <Chat />
    </main>
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
