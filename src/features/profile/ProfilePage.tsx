import { useProfile } from './useProfile'

export function ProfilePage() {
  const { data, isLoading, error } = useProfile()

  if (isLoading) {
    return <p className="text-slate-600">Loading profile…</p>
  }

  if (error) {
    return (
      <section className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-800">
        Failed to load profile: {error.message}
      </section>
    )
  }

  if (!data) {
    return null
  }

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold">Patient profile</h2>
      <p className="mt-1 text-sm text-slate-500">Read-only in Phase 4. Editing comes with auth.</p>
      <dl className="mt-6 grid gap-4 sm:grid-cols-2">
        <Field label="Name" value={data.name} />
        <Field label="Age" value={String(data.age)} />
        <Field label="Sex" value={data.sex} />
        <Field label="Date of birth" value={data.date_of_birth} />
        <Field label="Chronic conditions" value={data.chronic_conditions.join(', ') || '—'} />
        <Field label="Current medications" value={data.current_medications.join(', ') || '—'} />
        <Field label="Allergies" value={data.allergies.join(', ') || '—'} />
      </dl>
    </section>
  )
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-slate-500">{label}</dt>
      <dd className="mt-1 text-sm font-medium text-slate-900">{value}</dd>
    </div>
  )
}
