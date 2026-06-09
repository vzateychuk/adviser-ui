export function Spinner({ label = 'Загрузка…' }: { label?: string }) {
  return (
    <div className="flex items-center gap-2 text-sm text-slate-600" role="status">
      <span
        className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-teal-700"
        aria-hidden
      />
      <span>{label}</span>
    </div>
  )
}
