import { ApiError } from '../../core/errors/ApiError'
import { Spinner } from '../../shared/components/Spinner'
import { useToast } from '../../shared/components/useToast'
import { userFacingError } from '../../shared/utils/userFacingError'
import { ChatComposer } from './ChatComposer'
import { MessageList } from './MessageList'
import { useMessages } from './useMessages'
import { useSendMessage } from './useSendMessage'

type ChatThreadProps = {
  sessionId: string | undefined
}

export function ChatThread({ sessionId }: ChatThreadProps) {
  const { data: messages, isLoading, error } = useMessages(sessionId)
  const sendMessage = useSendMessage()
  const { showToast } = useToast()

  if (!sessionId) {
    return (
      <div className="flex flex-1 items-center justify-center bg-white p-6 text-center">
        <div>
          <p className="text-lg font-medium text-slate-800">Выберите или создайте консультацию</p>
          <p className="mt-2 text-sm text-slate-500">
            Слева — список ваших обращений. Можно начать новую консультацию в любой момент.
          </p>
        </div>
      </div>
    )
  }

  return (
    <section className="flex min-w-0 flex-1 flex-col bg-slate-100/50">
      {isLoading && (
        <div className="flex flex-1 items-center justify-center">
          <Spinner label="Загрузка сообщений…" />
        </div>
      )}
      {error && (
        <div className="m-4 rounded-xl bg-red-50 p-4 text-sm text-red-800">
          {userFacingError(error)}
        </div>
      )}
      {!isLoading && !error && (
        <MessageList messages={messages ?? []} isSending={sendMessage.isPending} />
      )}
      <ChatComposer
        key={sessionId}
        sessionId={sessionId}
        disabled={sendMessage.isPending || isLoading}
        onSend={async (content) => {
          try {
            await sendMessage.mutateAsync({ sessionId, content })
          } catch (err) {
            const message = userFacingError(err)
            showToast(message, 'error')
            if (err instanceof ApiError && err.code === 'llm_timeout') {
              throw err
            }
            throw new Error(message, { cause: err })
          }
        }}
        onError={(message) => showToast(message, 'error')}
      />
    </section>
  )
}
