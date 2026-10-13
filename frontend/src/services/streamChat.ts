import type { ChatMessage } from './api';

const apiBaseUrl = import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8000';

export async function streamChatMessage(
  messages: ChatMessage[],
  onToken: (token: string) => void,
  csrfToken: string,
  signal?: AbortSignal,
): Promise<void> {
  const response = await fetch(apiBaseUrl + '/api/ai/chat/stream', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'text/event-stream',
      'X-CSRF-Token': csrfToken,
    },
    body: JSON.stringify({ messages }),
    signal,
  });

  if (!response.ok || !response.body) {
    let detail = 'Streaming AI odpovědi se nepodařilo spustit.';

    try {
      const payload = (await response.json()) as { detail?: string };
      detail = payload.detail ?? detail;
    } catch {
      // Server nemusí vrátit JSON.
    }

    throw new Error(detail);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let completed = false;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true }).replace(/\r\n/g, '\n');
      const events = buffer.split('\n\n');
      buffer = events.pop() ?? '';

      for (const event of events) {
        const lines = event.split('\n');
        const type = lines.find((line) => line.startsWith('event:'))?.slice(6).trim();
        const data = lines
          .filter((line) => line.startsWith('data:'))
          .map((line) => line.slice(5).trim())
          .join('\n');

        if (type === 'error') {
          let message = 'Lokální AI server oznámil chybu.';

          try {
            const parsed: unknown = JSON.parse(data);
            if (typeof parsed === 'string') message = parsed;
          } catch {
            // Neznámý formát chybové odpovědi.
          }

          throw new Error(message);
        }

        if (data === '[DONE]') {
          completed = true;
          break;
        }

        if (!data) continue;

        try {
          const parsed = JSON.parse(data) as {
            choices?: Array<{ delta?: { content?: string } }>;
          };
          const token = parsed.choices?.[0]?.delta?.content;
          if (token) onToken(token);
        } catch {
          // Neznámý payload neobsahuje zobrazitelný token.
        }
      }

      if (completed) break;
    }

    if (!completed && !signal?.aborted) {
      throw new Error('LLM stream skončil bez potvrzení dokončení.');
    }
  } finally {
    reader.releaseLock();
  }
}
