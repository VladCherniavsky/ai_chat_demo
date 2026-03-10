import type { Message } from '../../features/chat/types.ts'
import { MessageList } from '../MessageList/index.ts'
import { PromptInput } from '../PromptInput/index.ts'

interface ChatWindowProps {
  messages: Message[]
  loading: boolean
  error: string | null
  onSend: (prompt: string) => void
  autoFocus?: boolean
  focusKey?: string | null
}

export function ChatWindow({
  messages,
  loading,
  error,
  onSend,
  autoFocus,
  focusKey,
}: ChatWindowProps) {
  return (
    <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
      {error && (
        <div className="mx-4 mt-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </div>
      )}

      <MessageList messages={messages} />
      <PromptInput onSend={onSend} loading={loading} autoFocus={autoFocus} focusKey={focusKey} />
    </div>
  )
}
