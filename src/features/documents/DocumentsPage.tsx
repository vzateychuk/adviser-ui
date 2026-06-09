import { useToast } from '../../shared/components/useToast'
import { userFacingError } from '../../shared/utils/userFacingError'
import { DocumentList } from './DocumentList'
import { DocumentUpload } from './DocumentUpload'
import { useDocuments } from './useDocuments'

export function DocumentsPage() {
  const { data: documents, isLoading, error, refetch } = useDocuments()
  const { showToast } = useToast()

  return (
    <div className="mx-auto max-w-3xl">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900">Медицинские документы</h1>
        <p className="mt-2 text-sm text-slate-600">
          Загружайте записи в формате Markdown — они будут доступны ассистенту при консультации.
        </p>
      </header>

      <DocumentUpload
        onSuccess={() => {
          showToast('Документ успешно добавлен', 'success')
          void refetch()
        }}
        onError={(message) => showToast(message, 'error')}
      />

      {error && (
        <p className="mt-4 rounded-xl bg-red-50 p-4 text-sm text-red-800">{userFacingError(error)}</p>
      )}

      <DocumentList documents={documents ?? []} isLoading={isLoading} />
    </div>
  )
}
