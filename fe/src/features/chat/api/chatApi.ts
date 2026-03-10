import { streamCompletion } from '../../../services/openrouter.ts'
import type { Message } from '../types.ts'

export async function streamChat(
  history: Message[],
  onToken: (token: string) => void,
  onDone: (fullContent: string) => void,
  onError: (err: string) => void,
): Promise<void> {
  const messages = history.map(({ role, content }) => ({ role, content }))
  await streamCompletion(messages, onToken, onDone, onError)
}
