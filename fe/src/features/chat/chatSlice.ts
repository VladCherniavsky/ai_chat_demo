import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { ChatState, Conversation, Message } from './types.ts'

const initialState: ChatState = {
  conversations: [],
  activeConversationId: null,
  loading: false,
  error: null,
}

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    createConversation(state, action: PayloadAction<Conversation>) {
      state.conversations.push(action.payload)
      state.activeConversationId = action.payload.id
    },
    appendMessages(
      state,
      action: PayloadAction<{ conversationId: string; messages: Message[] }>,
    ) {
      const conv = state.conversations.find((c) => c.id === action.payload.conversationId)
      if (conv) conv.messages.push(...action.payload.messages)
    },
    updateMessageToken(
      state,
      action: PayloadAction<{ conversationId: string; id: string; token: string }>,
    ) {
      const conv = state.conversations.find((c) => c.id === action.payload.conversationId)
      if (conv) {
        const msg = conv.messages.find((m) => m.id === action.payload.id)
        if (msg) msg.content += action.payload.token
      }
    },
    finalizeMessage(
      state,
      action: PayloadAction<{ conversationId: string; id: string; content: string }>,
    ) {
      const conv = state.conversations.find((c) => c.id === action.payload.conversationId)
      if (conv) {
        const msg = conv.messages.find((m) => m.id === action.payload.id)
        if (msg) {
          msg.content = action.payload.content
          msg.streaming = false
        }
      }
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload
    },
    setActiveConversationId(state, action: PayloadAction<string | null>) {
      state.activeConversationId = action.payload
    },
    deleteConversation(state, action: PayloadAction<string>) {
      state.conversations = state.conversations.filter((c) => c.id !== action.payload)
      if (state.activeConversationId === action.payload) {
        state.activeConversationId = null
      }
    },
    clearConversations(state) {
      state.conversations = []
      state.activeConversationId = null
      state.error = null
    },
  },
})

export const {
  createConversation,
  appendMessages,
  updateMessageToken,
  finalizeMessage,
  setLoading,
  setError,
  setActiveConversationId,
  deleteConversation,
  clearConversations,
} = chatSlice.actions

export default chatSlice.reducer
