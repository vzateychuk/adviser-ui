import { NavLink, Outlet, useLocation } from 'react-router-dom'

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  [
    'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
    isActive
      ? 'bg-teal-700 text-white'
      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
  ].join(' ')

export function AppLayout() {
  const location = useLocation()
  const isChat = location.pathname.startsWith('/chat')

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-teal-700">
              Медицинский ассистент
            </p>
            <h1 className="text-lg font-semibold text-slate-900">Консультации и медкарта</h1>
          </div>
          <nav className="flex items-center gap-1" aria-label="Основная навигация">
            <NavLink to="/chat" className={navLinkClass}>
              Консультации
            </NavLink>
            <NavLink to="/documents" className={navLinkClass}>
              Документы
            </NavLink>
            <NavLink to="/profile" className={navLinkClass}>
              Профиль
            </NavLink>
          </nav>
        </div>
      </header>
      <main
        className={[
          'mx-auto max-w-7xl',
          isChat ? 'px-4 py-3' : 'px-4 py-6',
        ].join(' ')}
      >
        <Outlet />
      </main>
    </div>
  )
}
