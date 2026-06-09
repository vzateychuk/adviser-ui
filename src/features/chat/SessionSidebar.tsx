import { Spinner } from '../../shared/components/Spinner'
import { useCreateSession } from './useSessionMutations'
import { useSessions } from './useSessions'
import { SessionListItem } from './SessionListItem'

type SessionSidebarProps = {
  activeSessionId?: string
  filter: 'active' | 'archived'
  onFilterChange: (filter: 'active' | 'archived') => void
  onSelectSession: (sessionId: string) => void
}

export function SessionSidebar({
  activeSessionId,
  filter,
  onFilterChange,
  onSelectSession,
}: SessionSidebarProps) {
  const { data: sessions, isLoading, error } = useSessions(filter)
  const createSession = useCreateSession()

  return (
    <aside className="flex w-full shrink-0 flex-col border-r border-slate-200 bg-slate-50 md:w-72 lg:w-80">
      <div className="border-b border-slate-200 p-4">
        <button
          type="button"
          onClick={() => createSession.mutate()}
          disabled={createSession.isPending}
          className="w-full rounded-xl bg-teal-700 px-4 py-2.5 text-sm font-medium text-white hover:bg-teal-800 disabled:bg-slate-300"
        >
          {createSession.isPending ? 'Создание…' : '+ Новая консультация'}
        </button>
      </div>

      <div className="flex border-b border-slate-200 p-2" role="tablist" aria-label="Фильтр консультаций">
        {(['active', 'archived'] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={filter === tab}
            onClick={() => onFilterChange(tab)}
            className={[
              'flex-1 rounded-lg px-3 py-2 text-sm font-medium',
              filter === tab
                ? 'bg-white text-teal-800 shadow-sm ring-1 ring-slate-200'
                : 'text-slate-600 hover:text-slate-900',
            ].join(' ')}
          >
            {tab === 'active' ? 'Активные' : 'Архив'}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        {isLoading && <Spinner label="Загрузка консультаций…" />}
        {error && (
          <p className="rounded-lg bg-red-50 p-3 text-sm text-red-800">
            Не удалось загрузить список консультаций
          </p>
        )}
        {!isLoading && sessions?.length === 0 && (
          <p className="px-2 py-4 text-center text-sm text-slate-500">
            {filter === 'active'
              ? 'Пока нет консультаций. Создайте новую.'
              : 'В архиве пока пусто.'}
          </p>
        )}
        <ul className="space-y-2">
          {sessions?.map((session) => (
            <li key={session.session_id}>
              <SessionListItem
                session={session}
                active={session.session_id === activeSessionId}
                onSelect={() => onSelectSession(session.session_id)}
              />
            </li>
          ))}
        </ul>
      </div>
    </aside>
  )
}
