import { createSelector } from '@reduxjs/toolkit'
import type { RootState } from '../../store/store.ts'
import type { Conversation } from './types.ts'

function getDateLabel(timestamp: number): string {
  const now = new Date()
  const date = new Date(timestamp)

  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return 'This week'

  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: diffDays > 365 ? 'numeric' : undefined,
  })
}

export const selectGroupedConversations = createSelector(
  (state: RootState) => state.chat.conversations,
  (conversations): { label: string; items: Conversation[] }[] => {
    const reversed = [...conversations].reverse()
    const map = new Map<string, Conversation[]>()

    for (const c of reversed) {
      const label = getDateLabel(c.createdAt)
      const group = map.get(label) ?? []
      group.push(c)
      map.set(label, group)
    }

    return Array.from(map.entries()).map(([label, items]) => ({ label, items }))
  },
)

export const selectLatestConversationId = (state: RootState): string | null =>
  state.chat.conversations.at(-1)?.id ?? null
