import type { DocumentDTO } from '../../core/api/generated/models'
import { useRef, useState } from 'react'
import { useUploadDocument } from './useUploadDocument'
import { userFacingError } from '../../shared/utils/userFacingError'

type DocumentUploadProps = {
  onSuccess: (doc: DocumentDTO) => void
  onError: (message: string) => void
}

export function DocumentUpload({ onSuccess, onError }: DocumentUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragOver, setDragOver] = useState(false)
  const upload = useUploadDocument()

  async function handleFile(file: File) {
    if (!file.name.toLowerCase().endsWith('.md')) {
      onError('Поддерживаются только файлы Markdown (.md)')
      return
    }

    try {
      const doc = await upload.mutateAsync(file)
      onSuccess(doc)
    } catch (error) {
      onError(userFacingError(error))
    }
  }

  function onInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (file) void handleFile(file)
    event.target.value = ''
  }

  return (
    <section className="rounded-2xl border border-dashed border-slate-300 bg-white p-6">
      <h2 className="text-lg font-semibold text-slate-900">Загрузить документ</h2>
      <p className="mt-1 text-sm text-slate-500">
        Перетащите файл Markdown (.md) или выберите на устройстве. Документ будет добавлен в вашу
        медкарту для консультаций.
      </p>

      <div
        role="button"
        tabIndex={0}
        onDragOver={(e) => {
          e.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragOver(false)
          const file = e.dataTransfer.files[0]
          if (file) void handleFile(file)
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click()
        }}
        className={[
          'mt-4 flex flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors',
          dragOver ? 'border-teal-400 bg-teal-50' : 'border-slate-200 bg-slate-50',
          upload.isPending ? 'opacity-60' : 'cursor-pointer hover:border-teal-300 hover:bg-teal-50/50',
        ].join(' ')}
        onClick={() => !upload.isPending && inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".md,text/markdown"
          className="sr-only"
          onChange={onInputChange}
          disabled={upload.isPending}
        />
        {upload.isPending ? (
          <>
            <p className="text-sm font-medium text-slate-800">Обработка документа…</p>
            <p className="mt-1 text-xs text-slate-500">Обычно это занимает несколько секунд</p>
          </>
        ) : (
          <>
            <p className="text-sm font-medium text-slate-800">Перетащите файл сюда</p>
            <p className="mt-1 text-xs text-slate-500">или нажмите для выбора</p>
          </>
        )}
      </div>
    </section>
  )
}
