import { describe, expect, it, vi } from 'vitest';

import { streamChatMessage } from './streamChat';

function createStreamResponse(chunks: string[]): Response {
  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      for (const chunk of chunks) controller.enqueue(encoder.encode(chunk));
      controller.close();
    },
  });

  return new Response(stream, {
    status: 200,
    headers: { 'Content-Type': 'text/event-stream' },
  });
}

describe('streamChatMessage', () => {
  it('zpracuje stream rozdělený do chunků', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(
      createStreamResponse([
        'data: {"choices":[{"delta":{"con',
        'tent":"Aho"}}]}\n\n',
        'data: {"choices":[{"delta":{"content":"j"}}]}\n\n',
        'data: [DONE]\n\n',
      ]),
    ));

    const tokens: string[] = [];
    await streamChatMessage([{ role: 'user', content: 'Ahoj' }], (token) => tokens.push(token), 'csrf');
    expect(tokens).toEqual(['Aho', 'j']);
  });

  it('propaguje chybovou SSE událost', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(
      createStreamResponse(['event: error\ndata: "LLM server není dostupný."\n\n']),
    ));

    await expect(
      streamChatMessage([{ role: 'user', content: 'test' }], vi.fn(), 'csrf'),
    ).rejects.toThrow('LLM server není dostupný.');
  });

  it('odmítne předčasně ukončený stream', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(
      createStreamResponse(['data: {"choices":[{"delta":{"content":"test"}}]}\n\n']),
    ));

    await expect(
      streamChatMessage([{ role: 'user', content: 'test' }], vi.fn(), 'csrf'),
    ).rejects.toThrow('bez potvrzení dokončení');
  });

  it('ignoruje prázdnou událost a DONE', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(
      createStreamResponse(['\n\n', 'data: [DONE]\n\n']),
    ));
    const onToken = vi.fn();
    await streamChatMessage([{ role: 'user', content: 'test' }], onToken, 'csrf');
    expect(onToken).not.toHaveBeenCalled();
  });

  it('odmítne neúspěšný HTTP response', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(null, { status: 503 })));
    await expect(
      streamChatMessage([{ role: 'user', content: 'test' }], vi.fn(), 'csrf'),
    ).rejects.toThrow('Streaming AI odpovědi se nepodařilo spustit.');
  });

  it('odesílá přihlašovací cookie a CSRF header', async () => {
    const fetchMock = vi.fn().mockResolvedValue(createStreamResponse(['data: [DONE]\n\n']));
    vi.stubGlobal('fetch', fetchMock);

    await streamChatMessage([{ role: 'user', content: 'test' }], vi.fn(), 'my-csrf');
    expect(fetchMock.mock.calls[0][1]).toMatchObject({
      credentials: 'include',
      headers: expect.objectContaining({ 'X-CSRF-Token': 'my-csrf' }),
    });
  });
});
