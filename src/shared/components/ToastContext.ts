import { createContext } from 'react'

export type ToastKind = 'error' | 'success' | 'info'

export type ToastContextValue = {
  showToast: (message: string, kind?: ToastKind) => void
}

export const ToastContext = createContext<ToastContextValue | null>(null)
