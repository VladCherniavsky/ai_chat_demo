import { useState } from 'react'
import { useAuth } from '../../auth/useAuth.ts'
import { useAppSelector } from '../../store/hooks.ts'
import { useChat } from './useChat.ts'
import { selectLatestConversationId } from '../../features/chat/chatSelectors.ts'
import { ChatHeader } from '../../components/ChatHeader/index.ts'
import { ChatWindow } from '../../components/ChatWindow/index.ts'
import { Sidebar } from '../../components/Sidebar/index.ts'

export function ChatPage() {
  const { logout } = useAuth()
  const { email } = useAppSelector((state) => state.auth)
  const latestConversationId = useAppSelector(selectLatestConversationId)
  const {
    messages,
    activeConversationId,
    selectSession,
    loading,
    error,
    sendMessage,
    deleteChat,
  } = useChat()

  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div
        className={`fixed inset-y-0 left-0 z-30 transition-transform duration-200 lg:static lg:translate-x-0 lg:z-auto ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <Sidebar
          activeConversationId={activeConversationId}
          onSelectSession={(id) => {
            selectSession(id)
            setSidebarOpen(false)
          }}
          onClose={() => setSidebarOpen(false)}
          onDeleteConversation={deleteChat}
          focusLatest={activeConversationId === null && latestConversationId !== null}
        />
      </div>

      <div className="flex flex-1 flex-col min-w-0">
        <ChatHeader
          email={email}
          onMenuClick={() => setSidebarOpen(true)}
          onLogout={logout}
        />
        <ChatWindow
          messages={messages}
          loading={loading}
          error={error}
          onSend={sendMessage}
          focusKey={activeConversationId}
        />
      </div>
    </div>
  )
}
