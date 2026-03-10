import { useState, useRef, useEffect, type KeyboardEvent } from 'react'
import { Spinner } from '../Spinner/index.ts'

interface PromptInputProps {
  onSend: (prompt: string) => void
  loading: boolean
  autoFocus?: boolean
  focusKey?: string | null
}

export function PromptInput({ onSend, loading, autoFocus, focusKey }: PromptInputProps) {
  const [value, setValue] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    textareaRef.current?.focus()
  }, [focusKey])

  function handleSend() {
    const trimmed = value.trim()
    if (!trimmed || loading) return
    onSend(trimmed)
    setValue('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  function handleInput() {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 180)}px`
  }

  return (
    <div className="border-t border-gray-200 bg-white px-4 py-3">
      <div className="flex items-center gap-2 rounded-xl border border-gray-300 bg-gray-50 px-3 py-2 shadow-sm focus-within:border-brand-teal focus-within:ring-1 focus-within:ring-brand-teal transition-all">
        <textarea
          ref={textareaRef}
          rows={1}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onInput={handleInput}
          placeholder="Send a message… (Enter to send, Shift+Enter for newline)"
          disabled={loading}
          autoFocus={autoFocus}
          className="flex-1 resize-none bg-transparent text-sm leading-relaxed text-gray-800 placeholder:text-gray-400 focus:outline-none disabled:opacity-60"
          style={{ minHeight: '24px', maxHeight: '180px' }}
        />
        <button
          type="button"
          onClick={handleSend}
          disabled={loading || !value.trim()}
          aria-label="Send message"
          className="mb-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-brand-navy text-white hover:bg-brand-navy-hover focus:outline-none focus:ring-2 focus:ring-brand-teal focus:ring-offset-1 disabled:opacity-40 transition-colors"
        >
          {loading ? (
            <Spinner size="sm" />
          ) : (
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
            </svg>
          )}
        </button>
      </div>
    </div>
  )
}
