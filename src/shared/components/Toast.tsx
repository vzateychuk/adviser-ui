import {
  useCallback,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { ToastContext, type ToastKind } from './ToastContext'

type ToastItem = {
  id: string
  message: string
  kind: ToastKind
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const showToast = useCallback((message: string, kind: ToastKind = 'info') => {
    const id = crypto.randomUUID()
    setToasts((prev) => [...prev, { id, message, kind }])
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 5000)
  }, [])

  const value = useMemo(() => ({ showToast }), [showToast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className="pointer-events-none fixed bottom-4 right-4 z-50 flex max-w-sm flex-col gap-2"
        aria-live="polite"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="status"
            className={[
              'pointer-events-auto rounded-xl px-4 py-3 text-sm shadow-lg',
              toast.kind === 'error' && 'bg-red-50 text-red-900 ring-1 ring-red-200',
              toast.kind === 'success' && 'bg-emerald-50 text-emerald-900 ring-1 ring-emerald-200',
              toast.kind === 'info' && 'bg-white text-slate-800 ring-1 ring-slate-200',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
