import type { Message } from '../../features/chat/types.ts'

interface MessageBubbleProps {
  message: Message
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user'

  return (
    <div className={`flex animate-fade-in ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap break-words ${
          isUser
            ? 'bg-brand-navy text-white rounded-br-sm'
            : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-bl-sm'
        }`}
      >
        {message.content || (message.streaming ? null : <span className="text-gray-400 italic">Empty response</span>)}
        {message.streaming && (
          <span className="ml-0.5 inline-block h-4 w-0.5 bg-current animate-blink" aria-hidden="true" />
        )}
      </div>
    </div>
  )
}
