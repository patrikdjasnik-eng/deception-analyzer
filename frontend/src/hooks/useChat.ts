import { useCallback, useState } from 'react';

import { sendChatMessage, type ChatMessage } from '../services/api';

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

    setMessages(nextMessages);
    setError(null);
    setIsLoading(true);

    try {
      const result = await sendChatMessage(nextMessages);
      setMessages([
        ...nextMessages,
        { role: 'assistant', content: result.content },
      ]);
    } catch (requestError) {
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
