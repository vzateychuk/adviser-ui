import { useState } from 'react'
import type { SessionDTO } from '../../core/api/generated/models'
import { formatDateTime } from '../../shared/utils/formatDate'
import { ConfirmDialog } from '../../shared/components/ConfirmDialog'
import {
  useArchiveSession,
  useDeleteSession,
  useRenameSession,
} from './useSessionMutations'

type SessionListItemProps = {
  session: SessionDTO
  active: boolean
  onSelect: () => void
}

export function SessionListItem({ session, active, onSelect }: SessionListItemProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [renaming, setRenaming] = useState(false)
  const [newTitle, setNewTitle] = useState(session.title)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const renameSession = useRenameSession()
  const archiveSession = useArchiveSession()
  const deleteSession = useDeleteSession()

  const isArchived = session.status === 'archived'

  function handleRenameSubmit(event: React.FormEvent) {
    event.preventDefault()
    const title = newTitle.trim()
    if (!title || title === session.title) {
      setRenaming(false)
      return
    }
    renameSession.mutate(
      { sessionId: session.session_id, title },
      { onSettled: () => setRenaming(false) },
    )
  }

  return (
    <>
      <div
        className={[
          'group relative rounded-xl border px-3 py-2 transition-colors',
          active
            ? 'border-teal-200 bg-teal-50'
            : 'border-transparent bg-white hover:border-slate-200 hover:bg-slate-50',
        ].join(' ')}
      >
        {renaming ? (
          <form onSubmit={handleRenameSubmit} className="space-y-2">
            <input
              autoFocus
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-2 py-1 text-sm"
            />
            <div className="flex gap-1">
              <button type="submit" className="rounded bg-teal-700 px-2 py-1 text-xs text-white">
                Сохранить
              </button>
              <button
                type="button"
                onClick={() => setRenaming(false)}
                className="rounded px-2 py-1 text-xs text-slate-600 hover:bg-slate-100"
              >
                Отмена
              </button>
            </div>
          </form>
        ) : (
          <>
            <button
              type="button"
              onClick={onSelect}
              className="w-full text-left"
            >
              <p className="truncate text-sm font-medium text-slate-900">{session.title}</p>
              <p className="mt-0.5 text-xs text-slate-500">{formatDateTime(session.updated_at)}</p>
            </button>
            <button
              type="button"
              aria-label="Действия с консультацией"
              onClick={() => setMenuOpen((v) => !v)}
              className="absolute right-2 top-2 rounded p-1 text-slate-400 opacity-0 hover:bg-slate-200 hover:text-slate-700 group-hover:opacity-100 focus:opacity-100"
            >
              ⋮
            </button>
            {menuOpen && (
              <div className="absolute right-2 top-8 z-10 w-44 rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
                <button
                  type="button"
                  className="block w-full px-3 py-2 text-left text-sm hover:bg-slate-50"
                  onClick={() => {
                    setMenuOpen(false)
                    setNewTitle(session.title)
                    setRenaming(true)
                  }}
                >
                  Переименовать
                </button>
                <button
                  type="button"
                  className="block w-full px-3 py-2 text-left text-sm hover:bg-slate-50"
                  onClick={() => {
                    setMenuOpen(false)
                    archiveSession.mutate({ sessionId: session.session_id, archived: !isArchived })
                  }}
                >
                  {isArchived ? 'Вернуть в активные' : 'В архив'}
                </button>
                <button
                  type="button"
                  className="block w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                  onClick={() => {
                    setMenuOpen(false)
                    setConfirmDelete(true)
                  }}
                >
                  Удалить
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <ConfirmDialog
        open={confirmDelete}
        title="Удалить консультацию?"
        description="История сообщений будет удалена без возможности восстановления."
        onCancel={() => setConfirmDelete(false)}
        onConfirm={() => {
          setConfirmDelete(false)
          deleteSession.mutate(session.session_id)
        }}
      />
    </>
  )
}
