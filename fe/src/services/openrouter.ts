const API_URL = 'https://openrouter.ai/api/v1/chat/completions'

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export async function streamCompletion(
  messages: ChatMessage[],
  onToken: (token: string) => void,
  onDone: (fullContent: string) => void,
  onError: (err: string) => void,
): Promise<void> {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY as string
  const model = (import.meta.env.VITE_OPENROUTER_MODEL as string) ?? 'anthropic/claude-3.5-sonnet'

  let res: Response
  try {
    res = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
        'HTTP-Referer': window.location.origin,
        'X-Title': 'AI Chat Demo',
      },
      body: JSON.stringify({ model, messages, stream: true }),
    })
  } catch (err) {
    onError(err instanceof Error ? err.message : 'Network error')
    return
  }

  if (!res.ok) {
    const text = await res.text()
    onError(`OpenRouter HTTP ${res.status}: ${text}`)
    return
  }

  if (!res.body) {
    onError('Response body is null — streaming not supported')
    return
  }

  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  let fullContent = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })

    const parts = buffer.split('\n\n')
    buffer = parts.pop() ?? ''

    for (const part of parts) {
      const line = part.trim()
      if (!line.startsWith('data: ')) continue

      const data = line.slice(6)
      if (data === '[DONE]') {
        onDone(fullContent)
        return
      }

      try {
        const parsed = JSON.parse(data) as {
          choices?: Array<{ delta?: { content?: string } }>
        }
        const token = parsed.choices?.[0]?.delta?.content ?? ''
        if (token) {
          fullContent += token
          onToken(token)
        }
      } catch {
        // skip malformed SSE data
      }
    }
  }

  onDone(fullContent)
}
