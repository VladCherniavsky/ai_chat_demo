interface ChatHeaderProps {
  email: string | null
  onMenuClick: () => void
  onLogout: () => void
}

export function ChatHeader({ email, onMenuClick, onLogout }: ChatHeaderProps) {
  return (
    <header className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3 shadow-sm">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open chat history"
          className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 transition-colors lg:hidden"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
          </svg>
        </button>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-navy text-white font-bold text-sm">
          AI
        </div>
        <span className="font-semibold text-gray-800">AI Chat</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="hidden text-xs text-gray-400 sm:block">{email}</span>
        <button
          type="button"
          onClick={onLogout}
          className="rounded-md px-2.5 py-1.5 text-xs font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
        >
          Sign out
        </button>
      </div>
    </header>
  )
}
