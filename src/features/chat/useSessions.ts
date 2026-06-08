import { useQuery } from '@tanstack/react-query'
import { listSessionsApiV1SessionsGet } from '../../core/api/generated/sessions/sessions'
import type { ListSessionsApiV1SessionsGetParams } from '../../core/api/generated/models'

export function useSessions(status?: 'active' | 'archived') {
  const params: ListSessionsApiV1SessionsGetParams | undefined = status ? { status } : undefined

  return useQuery({
    queryKey: ['sessions', params ?? 'all'],
    queryFn: async () => {
      const response = await listSessionsApiV1SessionsGet(params)
      return response.data
    },
  })
}
