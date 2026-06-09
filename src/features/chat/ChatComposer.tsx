import { useState } from 'react'
import { useDebouncedEffect } from '../../shared/hooks/useDebouncedEffect'
import { clearDraft, getDraft, setDraft } from './sessionStorage'

type ChatComposerProps = {
  sessionId: string
  disabled: boolean
  onSend: (content: string) => Promise<void>
  onError: (message: string) => void
}

export function ChatComposer({ sessionId, disabled, onSend, onError }: ChatComposerProps) {
  const [text, setText] = useState(() => getDraft(sessionId))
  const [isSending, setIsSending] = useState(false)

  useDebouncedEffect(() => {
    setDraft(sessionId, text)
  }, [sessionId, text], 400)

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    const trimmed = text.trim()
    if (!trimmed || disabled || isSending) return

    setIsSending(true)
    const saved = trimmed
    setText('')
    clearDraft(sessionId)

    try {
      await onSend(saved)
    } catch (error) {
      setText(saved)
      setDraft(sessionId, saved)
      onError(error instanceof Error ? error.message : 'Не удалось отправить сообщение')
    } finally {
      setIsSending(false)
    }
  }

  const inputDisabled = disabled || isSending

  return (
    <form
      onSubmit={(e) => void handleSubmit(e)}
      className="border-t border-slate-200 bg-white px-4 py-4"
    >
      <label htmlFor="chat-input" className="sr-only">
        Ваш вопрос
      </label>
      <div className="flex gap-2">
        <textarea
          id="chat-input"
          rows={2}
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={inputDisabled}
          placeholder="Опишите симптомы или задайте вопрос…"
          className="min-h-[3rem] flex-1 resize-none rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-100 disabled:bg-slate-50"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              void handleSubmit(e)
            }
          }}
        />
        <button
          type="submit"
          disabled={inputDisabled || !text.trim()}
          className="self-end rounded-xl bg-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {isSending ? '…' : 'Отправить'}
        </button>
      </div>
      <p className="mt-2 text-xs text-slate-400">Enter — отправить, Shift+Enter — новая строка</p>
    </form>
  )
}
