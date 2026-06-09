import { useMutation, useQueryClient } from '@tanstack/react-query'
import { sendMessageApiV1SessionsSessionIdMessagesPost } from '../../core/api/generated/chat/chat'
import { queryKeys } from '../../core/queryKeys'
import { clearDraft } from './sessionStorage'

export function useSendMessage() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ sessionId, content }: { sessionId: string; content: string }) => {
      const response = await sendMessageApiV1SessionsSessionIdMessagesPost(sessionId, { content })
      return response.data
    },
    onSuccess: (_data, { sessionId }) => {
      clearDraft(sessionId)
      void queryClient.invalidateQueries({ queryKey: queryKeys.messages(sessionId) })
      void queryClient.invalidateQueries({ queryKey: ['sessions'] })
    },
  })
}
