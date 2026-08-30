import { useCallback, useState } from 'react';

import type { ChatMessage } from '../services/api';
import { streamChatMessage } from '../services/streamChat';

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (content: string) => {
    const trimmedContent = content.trim();

    if (!trimmedContent || isLoading) {
      return;
    }

    const nextMessages: ChatMessage[] = [
      ...messages,
      { role: 'user', content: trimmedContent },
    ];

    setMessages([
      ...nextMessages,
      { role: 'assistant', content: '' },
    ]);
    setError(null);
    setIsLoading(true);

    try {
      let assistantContent = '';

      await streamChatMessage(nextMessages, (token) => {
        assistantContent += token;
        setMessages([
          ...nextMessages,
          { role: 'assistant', content: assistantContent },
        ]);
      });
    } catch (requestError) {
      setMessages(nextMessages);
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'AI požadavek se nepodařilo dokončit.',
      );
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, messages]);

  const clearChat = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearChat,
  };
}
