import type { ChatMessage } from './api';

const apiBaseUrl = import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8000';

export async function streamChatMessage(
  messages: ChatMessage[],
  onToken: (token: string) => void,
): Promise<void> {
  const response = await fetch(`${apiBaseUrl}/api/ai/chat/stream`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'text/event-stream',
    },
    body: JSON.stringify({ messages }),
  });

  if (!response.ok || !response.body) {
    throw new Error('Streaming AI odpovědi se nepodařilo spustit.');
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  try {
    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        break;
      }

      buffer += decoder.decode(value, { stream: true });
      const events = buffer.split('\n\n');
      buffer = events.pop() ?? '';

      for (const event of events) {
        const data = event
          .split('\n')
          .filter((line) => line.startsWith('data:'))
          .map((line) => line.slice(5).trim())
          .join('\n');

        if (!data || data === '[DONE]') {
          continue;
        }

        try {
          const parsed = JSON.parse(data) as {
            choices?: Array<{ delta?: { content?: string } }>;
          };
          const token = parsed.choices?.[0]?.delta?.content;

          if (token) {
            onToken(token);
          }
        } catch {
          // Ignorujeme neúplný nebo neznámý SSE payload.
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}
