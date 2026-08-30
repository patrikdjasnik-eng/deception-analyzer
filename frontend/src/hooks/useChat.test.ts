import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { streamChatMessage } from '../services/streamChat';
import { useChat } from './useChat';

vi.mock('../services/streamChat', () => ({
  streamChatMessage: vi.fn(),
}));

describe('useChat', () => {
  it('přidá uživatelskou zprávu a streamovanou odpověď AI', async () => {
    vi.mocked(streamChatMessage).mockImplementation(async (_messages, onToken) => {
      onToken('Ahoj');
      onToken(' světe');
    });

    const { result } = renderHook(() => useChat());

    await act(async () => {
      await result.current.sendMessage('Test');
    });

    expect(result.current.messages).toEqual([
      { role: 'user', content: 'Test' },
      { role: 'assistant', content: 'Ahoj světe' },
    ]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('odmítne prázdnou zprávu', async () => {
    const { result } = renderHook(() => useChat());

    await act(async () => {
      await result.current.sendMessage('   ');
    });

    expect(result.current.messages).toEqual([]);
    expect(streamChatMessage).not.toHaveBeenCalled();
  });

  it('vrátí chybu při selhání streamu', async () => {
    vi.mocked(streamChatMessage).mockRejectedValueOnce(new Error('LLM server není dostupný.'));

    const { result } = renderHook(() => useChat());

    await act(async () => {
      await result.current.sendMessage('Test');
    });

    expect(result.current.error).toBe('LLM server není dostupný.');
    expect(result.current.messages).toEqual([
      { role: 'user', content: 'Test' },
    ]);
  });
});
