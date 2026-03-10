import type { AppThunk } from '../../store/store.ts'
import { streamChat } from './api/chatApi.ts'
import {
  appendMessages,
  createConversation,
  finalizeMessage,
  setError,
  setLoading,
  updateMessageToken,
} from './chatSlice.ts'
import type { Conversation, Message } from './types.ts'

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export function sendMessage(prompt: string): AppThunk {
  return async (dispatch, getState) => {
    const { loading, conversations, activeConversationId } = getState().chat
    if (!prompt.trim() || loading) return

    dispatch(setError(null))
    dispatch(setLoading(true))

    const userMsg: Message = {
      id: generateId(),
      role: 'user',
      content: prompt,
      timestamp: Date.now(),
    }

    const assistantMsg: Message = {
      id: generateId(),
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
      streaming: true,
    }

    let convId = activeConversationId
    let existingMessages: Message[] = []

    if (!convId) {
      const newConv: Conversation = {
        id: generateId(),
        messages: [],
        createdAt: Date.now(),
        title: prompt.slice(0, 60),
      }
      dispatch(createConversation(newConv))
      convId = newConv.id
    } else {
      const conv = conversations.find((c) => c.id === convId)
      existingMessages = (conv?.messages ?? []).filter((m) => !m.streaming)
    }

    dispatch(appendMessages({ conversationId: convId, messages: [userMsg, assistantMsg] }))

    const history: Message[] = [...existingMessages, userMsg]

    try {
      await streamChat(
        history,
        (token) => {
          dispatch(updateMessageToken({ conversationId: convId!, id: assistantMsg.id, token }))
        },
        (fullContent) => {
          dispatch(finalizeMessage({ conversationId: convId!, id: assistantMsg.id, content: fullContent }))
          dispatch(setLoading(false))
        },
        (errMsg) => {
          dispatch(setError(errMsg))
          dispatch(finalizeMessage({ conversationId: convId!, id: assistantMsg.id, content: `(error: ${errMsg})` }))
          dispatch(setLoading(false))
        },
      )
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error'
      dispatch(setError(msg))
      dispatch(finalizeMessage({ conversationId: convId!, id: assistantMsg.id, content: `(error: ${msg})` }))
      dispatch(setLoading(false))
    }
  }
}
