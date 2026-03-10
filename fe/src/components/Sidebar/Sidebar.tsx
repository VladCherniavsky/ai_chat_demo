import { useAppSelector } from '../../store/hooks.ts'
import {
  selectGroupedConversations,
  selectLatestConversationId,
} from '../../features/chat/chatSelectors.ts'

interface SidebarProps {
  activeConversationId: string | null
  onSelectSession: (id: string | null) => void
  onDeleteConversation: (id: string) => void
  onClose?: () => void
  focusLatest?: boolean
}

export function Sidebar({ activeConversationId, onSelectSession, onDeleteConversation, onClose, focusLatest }: SidebarProps) {
  const grouped = useAppSelector(selectGroupedConversations)
  const latestConversationId = useAppSelector(selectLatestConversationId)
  const hasConversations = grouped.length > 0

  return (
    <aside className="flex h-full w-64 flex-shrink-0 flex-col overflow-hidden border-r border-gray-200 bg-white">
      <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
        <span className="text-sm font-semibold text-gray-700">Chat History</span>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close sidebar"
            className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      <div className="px-3 py-2">
        <button
          type="button"
          onClick={() => onSelectSession(null)}
          className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
            activeConversationId === null
              ? 'bg-brand-navy text-white'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <svg
            className="h-4 w-4 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z" />
          </svg>
          <span className="truncate font-medium">New conversation</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-3 pb-4 scrollbar-thin">
        {!hasConversations ? (
          <p className="px-3 pt-2 text-xs text-gray-400">No previous chats yet.</p>
        ) : (
          grouped.map(({ label, items }) => (
            <div key={label} className="mt-2">
              <p className="mb-1 px-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                {label}
              </p>
              <ul className="space-y-0.5">
                {items.map((conv) => {
                  const isLatest = conv.id === latestConversationId
                  const isActive = activeConversationId === conv.id
                  return (
                    <li key={conv.id} className="group relative">
                      <button
                        type="button"
                        onClick={() => onSelectSession(conv.id)}
                        title={conv.title}
                        autoFocus={focusLatest && isLatest}
                        className={`flex w-full items-start gap-2 rounded-lg px-3 py-2 pr-8 text-left text-sm transition-colors ${
                          isActive
                            ? 'bg-brand-navy/10 text-brand-navy'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        <svg
                          className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 opacity-50"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 0 1 1.037-.443 48.282 48.282 0 0 0 5.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                        </svg>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate leading-snug">
                            {conv.title}
                          </span>
                          <span className="mt-0.5 block text-[11px] text-gray-400">
                            {formatTime(conv.createdAt)}
                            {isLatest && (
                              <span className="ml-1.5 inline-flex items-center rounded-full bg-brand-teal/15 px-1.5 py-0.5 text-[10px] font-medium text-brand-teal">
                                latest
                              </span>
                            )}
                          </span>
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          onDeleteConversation(conv.id)
                        }}
                        aria-label="Delete conversation"
                        className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded p-1 text-gray-400 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-50 hover:text-red-500"
                      >
                        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                        </svg>
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))
        )}
      </div>
    </aside>
  )
}

function formatTime(ts: number): string {
  return new Date(ts).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
}
