import { describe, expect, it, vi } from 'vitest';

import { streamChatMessage } from './streamChat';

function createStreamResponse(chunks: string[]): Response {
  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      for (const chunk of chunks) {
        controller.enqueue(encoder.encode(chunk));
      }
      controller.close();
    },
  });

  return new Response(stream, {
    status: 200,
    headers: { 'Content-Type': 'text/event-stream' },
  });
}

describe('streamChatMessage', () => {
  it('zpracuje tokeny ze SSE streamu', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(
      createStreamResponse([
        'data: {"choices":[{"delta":{"content":"Aho"}}]}\n\n',
        'data: {"choices":[{"delta":{"content":"j"}}]}\n\n',
        'data: [DONE]\n\n',
      ]),
    ));

    const tokens: string[] = [];

    await streamChatMessage(
      [{ role: 'user', content: 'Ahoj' }],
      (token) => tokens.push(token),
    );

    expect(tokens).toEqual(['Aho', 'j']);
  });

  it('zpracuje událost rozdělenou mezi síťové chunky', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(
      createStreamResponse([
        'data: {"choices":[{"delta":{"con',
        'tent":"test"}}]}\n\n',
        'data: [DONE]\n\n',
      ]),
    ));

    const tokens: string[] = [];

    await streamChatMessage(
      [{ role: 'user', content: 'test' }],
      (token) => tokens.push(token),
    );

    expect(tokens).toEqual(['test']);
  });

  it('ignoruje prázdné SSE události a [DONE]', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(
      createStreamResponse([
        '\n\n',
        'data: [DONE]\n\n',
      ]),
    ));

    const onToken = vi.fn();

    await streamChatMessage(
      [{ role: 'user', content: 'test' }],
      onToken,
    );

    expect(onToken).not.toHaveBeenCalled();
  });

  it('odmítne neúspěšný HTTP response', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(
      new Response(null, { status: 503 }),
    ));

    await expect(
      streamChatMessage([{ role: 'user', content: 'test' }], vi.fn()),
    ).rejects.toThrow('Streaming AI odpovědi se nepodařilo spustit.');
  });
});
