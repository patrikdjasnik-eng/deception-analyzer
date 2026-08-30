export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ChatResponse {
  content: string;
}

const apiBaseUrl = import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8000';

export async function sendChatMessage(messages: ChatMessage[]): Promise<ChatResponse> {
  const response = await fetch(`${apiBaseUrl}/api/ai/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ messages }),
  });

  if (!response.ok) {
    let detail = 'Požadavek na AI se nepodařilo dokončit.';

    try {
      const error = (await response.json()) as { detail?: string };
      detail = error.detail ?? detail;
    } catch {
      // odpověď serveru nemusí obsahovat JSON
    }

    throw new Error(detail);
  }

  return (await response.json()) as ChatResponse;
}
