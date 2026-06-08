import { Suspense } from 'react'
import { RouterProvider } from 'react-router-dom'
import { ErrorBoundary } from '../shared/components/ErrorBoundary'
import { AppProviders } from './providers'
import { router } from './router'

function PageLoader() {
  return <p className="text-slate-600">Loading…</p>
}

export function App() {
  return (
    <ErrorBoundary>
      <AppProviders>
        <Suspense fallback={<PageLoader />}>
          <RouterProvider router={router} />
        </Suspense>
      </AppProviders>
    </ErrorBoundary>
  )
}
