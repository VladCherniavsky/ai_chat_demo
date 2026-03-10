export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
  /** True while the assistant is still streaming tokens */
  streaming?: boolean
}

export interface Conversation {
  id: string
  messages: Message[]
  createdAt: number
  /** First user message content (truncated to 60 chars) */
  title: string
}

export interface ChatState {
  conversations: Conversation[]
  activeConversationId: string | null
  loading: boolean
  error: string | null
}
