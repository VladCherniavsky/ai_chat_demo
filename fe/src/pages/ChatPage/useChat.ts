import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks.ts';
import { setActiveConversationId, deleteConversation, clearConversations } from '../../features/chat/chatSlice.ts';
import { sendMessage as sendMessageThunk } from '../../features/chat/chatThunks.ts';
import { selectLatestConversationId } from '../../features/chat/chatSelectors.ts';

export function useChat() {
  const dispatch = useAppDispatch();
  const { conversations, activeConversationId, loading, error } =
    useAppSelector((state) => state.chat);
  const latestConversationId = useAppSelector(selectLatestConversationId);

  const isCurrentSession =
    activeConversationId === null ||
    activeConversationId === latestConversationId;

  const messages =
    conversations.find((c) => c.id === activeConversationId)?.messages ?? [];

  const selectSession = useCallback(
    (id: string | null) => {
      dispatch(setActiveConversationId(id));
    },
    [dispatch],
  );

  const sendMessage = useCallback(
    (prompt: string) => {
      dispatch(sendMessageThunk(prompt));
    },
    [dispatch],
  );

  const deleteChat = useCallback(
    (id: string) => {
      dispatch(deleteConversation(id));
    },
    [dispatch],
  );

  const clearChat = useCallback(() => {
    dispatch(clearConversations());
  }, [dispatch]);

  return {
    messages,
    activeConversationId,
    isCurrentSession,
    selectSession,
    loading,
    error,
    sendMessage,
    deleteChat,
    clearChat,
  };
}
