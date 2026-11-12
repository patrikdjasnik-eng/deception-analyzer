import { useState, type FormEvent } from 'react';

import { useChat } from '../../hooks/useChat';

type ChatProps = { csrfToken: string };

export function Chat({ csrfToken }: ChatProps) {
  const [input, setInput] = useState('');
  const { messages, isLoading, error, sendMessage, clearChat, cancel } = useChat(csrfToken);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!input.trim()) return;

    const content = input;
    setInput('');
    await sendMessage(content);
  }

  return (
    <section className="chat" aria-label="AI chat">
      <header className="chatHeader">
        <div>
          <span className="eyebrow">AI Security Agent</span>
          <h2>RabbitHollow AI</h2>
        </div>
        <button type="button" onClick={clearChat} disabled={!messages.length}>Nový chat</button>
      </header>
      <div className="chatMessages" aria-live="polite">
        {!messages.length && (
          <p className="chatEmpty">Zeptejte se RabbitHollow AI na bezpečnostní situaci.</p>
        )}
        {messages.map((message, index) => (
          <article className={'message message-' + message.role} key={message.role + index}>
            <span>{message.role === 'user' ? 'Vy' : 'RabbitHollow AI'}</span>
            <p>{message.content}</p>
          </article>
        ))}
        {isLoading && <p className="chatStatus">AI pracuje…</p>}
        {error && <p className="chatError" role="alert">{error}</p>}
      </div>
      <form className="chatForm" onSubmit={(event) => void handleSubmit(event)}>
        <textarea
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Napište zprávu…"
          rows={3}
          disabled={isLoading}
          maxLength={12000}
        />
        <button type="submit" disabled={isLoading || !input.trim()}>Odeslat</button>
        {isLoading && <button type="button" onClick={cancel}>Zastavit generování</button>}
      </form>
    </section>
  );
}
