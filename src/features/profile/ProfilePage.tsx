import { useProfile } from './useProfile'
import { Spinner } from '../../shared/components/Spinner'
import { userFacingError } from '../../shared/utils/userFacingError'
import { formatDate } from '../../shared/utils/formatDate'

export function ProfilePage() {
  const { data, isLoading, error } = useProfile()

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl py-12">
        <Spinner label="Загрузка профиля…" />
      </div>
    )
  }

  if (error) {
    return (
      <section className="mx-auto max-w-3xl rounded-2xl border border-red-200 bg-red-50 p-6 text-red-800">
        {userFacingError(error)}
      </section>
    )
  }

  if (!data) {
    return null
  }

  return (
    <div className="mx-auto max-w-3xl">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900">Мой профиль</h1>
        <p className="mt-2 text-sm text-slate-600">
          Эти данные используются ассистентом для персональных рекомендаций. Редактирование будет
          доступно после входа в систему.
        </p>
      </header>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <dl className="grid gap-6 sm:grid-cols-2">
          <Field label="ФИО" value={data.name} />
          <Field label="Возраст" value={`${data.age} лет`} />
          <Field label="Пол" value={data.sex} />
          <Field label="Дата рождения" value={formatDate(data.date_of_birth)} />
        </dl>

        <div className="mt-8 space-y-6 border-t border-slate-100 pt-6">
          <ListField label="Хронические заболевания" items={data.chronic_conditions} />
          <ListField label="Текущие препараты" items={data.current_medications} />
          <ListField label="Аллергии" items={data.allergies} />
        </div>
      </section>

      <p className="mt-4 text-xs text-slate-400">
        Информация носит справочный характер и не заменяет консультацию врача.
      </p>
    </div>
  )
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</dt>
      <dd className="mt-1 text-base text-slate-900">{value}</dd>
    </div>
  )
}

function ListField({ label, items }: { label: string; items: string[] }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</dt>
      {items.length === 0 ? (
        <dd className="mt-2 text-sm text-slate-500">Не указано</dd>
      ) : (
        <dd className="mt-2">
          <ul className="space-y-1">
            {items.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-slate-800">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-600" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        </dd>
      )}
    </div>
  )
}
