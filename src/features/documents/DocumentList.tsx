import type { DocumentDTO } from '../../core/api/generated/models'
import { formatDate, formatDateTime } from '../../shared/utils/formatDate'

type DocumentListProps = {
  documents: DocumentDTO[]
  isLoading: boolean
}

export function DocumentList({ documents, isLoading }: DocumentListProps) {
  if (isLoading) {
    return (
      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
        <p className="text-sm text-slate-600">Загрузка списка документов…</p>
      </section>
    )
  }

  return (
    <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Ваши документы</h2>
          <p className="mt-1 text-sm text-slate-500">
            {documents.length === 0
              ? 'Пока нет загруженных документов'
              : `${documents.length} ${pluralDocs(documents.length)} в медкарте`}
          </p>
        </div>
      </div>

      {documents.length === 0 ? (
        <p className="mt-6 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
          Загрузите выписку, результаты анализов или другую медицинскую запись в формате Markdown —
          ассистент сможет использовать их при консультации.
        </p>
      ) : (
        <ul className="mt-4 divide-y divide-slate-100">
          {documents.map((doc) => {
            const displayName = documentDisplayName(doc)
            return (
              <li
                key={doc.id}
                className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-900" title={displayName}>
                    {displayName}
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    {doc.category} · дата записи {formatDate(doc.document_date)}
                  </p>
                  <p className="mt-0.5 break-all font-mono text-xs text-slate-400" title={doc.id}>
                    id: {doc.id}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <StatusBadge indexedAt={doc.indexed_at} />
                  <span className="text-xs text-slate-400">
                    добавлен {formatDateTime(doc.indexed_at)}
                  </span>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}

function documentDisplayName(doc: DocumentDTO): string {
  const basename = basenameFromPath(doc.source_path)
  if (basename && !isLegacyFilestoreName(basename, doc.id)) {
    return basename
  }
  if (basename && isLegacyFilestoreName(basename, doc.id)) {
    return doc.category || 'Документ'
  }
  return doc.id
}

/** Extract filename from upload path or Windows filestore path. */
function basenameFromPath(path: string | undefined): string | null {
  const trimmed = path?.trim()
  if (!trimmed) return null
  const segments = trimmed.replace(/\\/g, '/').split('/')
  return segments[segments.length - 1] || null
}

/** Legacy rows stored as .data/filestore/{document_id}.md — not the original upload name. */
function isLegacyFilestoreName(basename: string, documentId: string): boolean {
  const stem = basename.replace(/\.md$/i, '')
  return stem.toLowerCase() === documentId.toLowerCase()
}

function StatusBadge({ indexedAt }: { indexedAt: string }) {
  const ready = Boolean(indexedAt)
  return (
    <span
      className={[
        'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium',
        ready ? 'bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200' : 'bg-amber-50 text-amber-800',
      ].join(' ')}
    >
      {ready ? 'Готов' : 'Обработка…'}
    </span>
  )
}

function pluralDocs(count: number) {
  const mod10 = count % 10
  const mod100 = count % 100
  if (mod10 === 1 && mod100 !== 11) return 'документ'
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return 'документа'
  return 'документов'
}
