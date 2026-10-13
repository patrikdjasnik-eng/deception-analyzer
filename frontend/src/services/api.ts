export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatResponse {
  content: string;
}

const apiBaseUrl = import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8000';

export async function sendChatMessage(messages: ChatMessage[], csrfToken: string): Promise<ChatResponse> {
  const response = await fetch(apiBaseUrl + '/api/ai/chat', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': csrfToken,
    },
    body: JSON.stringify({ messages }),
  });

  if (!response.ok) {
    let detail = 'Požadavek na AI se nepodařilo dokončit.';

    try {
      const error = (await response.json()) as { detail?: string };
      detail = error.detail ?? detail;
    } catch {
      // Odpověď serveru nemusí obsahovat JSON.
    }

    throw new Error(detail);
  }

  return (await response.json()) as ChatResponse;
}
