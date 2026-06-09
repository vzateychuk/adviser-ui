import type { MessageDTO } from '../../core/api/generated/models'
import { formatDateTime } from '../../shared/utils/formatDate'
import { MarkdownContent } from './MarkdownContent'
import { displayUserContent } from './displayUserContent'
import { extractCitations } from './parseMessageContent'

type MessageBubbleProps = {
  message: MessageDTO
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user'
  const citations = !isUser ? extractCitations(message.content) : []

  return (
    <article
      className={['flex', isUser ? 'justify-end' : 'justify-start'].join(' ')}
      aria-label={isUser ? 'Ваше сообщение' : 'Ответ ассистента'}
    >
      <div
        className={[
          'max-w-[85%] rounded-2xl px-4 py-3',
          isUser ? 'bg-teal-700 text-white' : 'bg-white text-slate-900 ring-1 ring-slate-200',
        ].join(' ')}
      >
        <div className="mb-1 flex items-center justify-between gap-3">
          <span className={`text-xs font-medium ${isUser ? 'text-teal-100' : 'text-slate-500'}`}>
            {isUser ? 'Вы' : 'Ассистент'}
          </span>
          <time
            className={`text-xs ${isUser ? 'text-teal-100' : 'text-slate-400'}`}
            dateTime={message.created_at}
          >
            {formatDateTime(message.created_at)}
          </time>
        </div>

        {isUser ? (
          <p className="whitespace-pre-wrap text-sm leading-relaxed">{displayUserContent(message.content)}</p>
        ) : (
          <div className="prose-chat">
            <MarkdownContent content={message.content} />
          </div>
        )}

        {!isUser && citations.length > 0 && (
          <details className="mt-3 rounded-lg bg-slate-50 p-3 text-sm ring-1 ring-slate-100">
            <summary className="cursor-pointer font-medium text-slate-700">
              Источники из медкарты ({citations.length})
            </summary>
            <ul className="mt-2 space-y-1 text-slate-600">
              {citations.map((c) => (
                <li key={`${c.id}-${c.date}`} className="text-xs leading-relaxed">
                  {c.id} · {c.date}
                </li>
              ))}
            </ul>
          </details>
        )}
      </div>
    </article>
  )
}
