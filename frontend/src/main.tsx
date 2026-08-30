import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

function App() {
  return (
    <main className="app">
      <section className="appCard">
        <span className="eyebrow">RabbitHollow</span>
        <h1>Deception Analyzer</h1>
        <p>Security analysis platform.</p>
      </section>
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
