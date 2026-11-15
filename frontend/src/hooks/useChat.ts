import { useCallback, useRef, useState } from 'react';

import type { ChatMessage } from '../services/api';
import { streamChatMessage } from '../services/streamChat';

export function useChat(csrfToken: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const generationRef = useRef(0);

  const sendMessage = useCallback(async (content: string) => {
    const trimmedContent = content.trim();

    if (!trimmedContent || abortRef.current) return;

    const currentRun = ++generationRef.current;
    const controller = new AbortController();
    abortRef.current = controller;
    const nextMessages: ChatMessage[] = [
      ...messages,
      { role: 'user', content: trimmedContent },
    ];

    setMessages([...nextMessages, { role: 'assistant', content: '' }]);
    setError(null);
    setIsLoading(true);

    try {
      let assistantContent = '';

      await streamChatMessage(nextMessages, (token) => {
        if (currentRun !== generationRef.current) return;

        assistantContent += token;
        setMessages([...nextMessages, { role: 'assistant', content: assistantContent }]);
      }, csrfToken, controller.signal);

      if (!assistantContent && currentRun === generationRef.current) {
        setMessages(nextMessages);
      }
    } catch (requestError) {
      if (currentRun !== generationRef.current) return;

      if (!controller.signal.aborted) {
        setMessages(nextMessages);
        setError(requestError instanceof Error ? requestError.message : 'AI požadavek se nepodařilo dokončit.');
      }
    } finally {
      if (currentRun === generationRef.current) {
        abortRef.current = null;
        setIsLoading(false);
      }
    }
  }, [csrfToken, messages]);

  const cancel = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  const clearChat = useCallback(() => {
    generationRef.current += 1;
    abortRef.current?.abort();
    abortRef.current = null;
    setMessages([]);
    setError(null);
    setIsLoading(false);
  }, []);

  return { messages, isLoading, error, sendMessage, clearChat, cancel };
}
