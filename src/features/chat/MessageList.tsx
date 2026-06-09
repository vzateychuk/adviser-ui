import { useEffect, useRef } from 'react'
import type { MessageDTO } from '../../core/api/generated/models'
import { MessageBubble } from './MessageBubble'

type MessageListProps = {
  messages: MessageDTO[]
  isSending: boolean
}

export function MessageList({ messages, isSending }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isSending])

  if (messages.length === 0 && !isSending) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <p className="text-lg font-medium text-slate-800">Начните консультацию</p>
        <p className="mt-2 max-w-md text-sm text-slate-500">
          Опишите симптомы или задайте вопрос о ваших медицинских документах. Ассистент ответит на
          основе загруженных записей.
        </p>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
      {messages.map((message) => (
        <MessageBubble key={message.message_id} message={message} />
      ))}
      {isSending && (
        <div className="flex justify-start">
          <div className="rounded-2xl bg-white px-4 py-3 ring-1 ring-slate-200">
            <p className="text-sm text-slate-600">Ассистент готовит ответ…</p>
            <p className="mt-1 text-xs text-slate-400">Это может занять до минуты</p>
          </div>
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  )
}
