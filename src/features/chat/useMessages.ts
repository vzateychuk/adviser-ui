import { useQuery } from '@tanstack/react-query'
import { listMessagesApiV1SessionsSessionIdMessagesGet } from '../../core/api/generated/chat/chat'
import { queryKeys, assertData, type MessageDTO } from '../../core/queryKeys'

export function useMessages(sessionId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.messages(sessionId ?? ''),
    enabled: Boolean(sessionId),
    queryFn: async () => {
      const response = await listMessagesApiV1SessionsSessionIdMessagesGet(sessionId!)
      return assertData<MessageDTO[]>(response.data)
    },
  })
}
