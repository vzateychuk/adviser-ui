import { ApiError } from '../../core/errors/ApiError'

const CODE_MESSAGES: Record<string, string> = {
  not_found: 'Запись не найдена.',
  validation_error: 'Проверьте введённые данные.',
  llm_timeout: 'Ответ занимает слишком много времени. Попробуйте ещё раз.',
  llm_unavailable: 'Сервис временно недоступен. Попробуйте позже.',
  llm_request_invalid: 'Не удалось обработать запрос. Переформулируйте вопрос.',
  ingest_failed: 'Не удалось обработать документ. Проверьте формат файла.',
  internal_error: 'Произошла ошибка. Попробуйте позже.',
  network_error: 'Нет связи с сервером. Проверьте подключение.',
}

export function userFacingError(error: unknown): string {
  if (error instanceof ApiError) {
    return CODE_MESSAGES[error.code] ?? error.message
  }
  if (error instanceof Error) {
    return error.message
  }
  return 'Произошла непредвиденная ошибка.'
}
