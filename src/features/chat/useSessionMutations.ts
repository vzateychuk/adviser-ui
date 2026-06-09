import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import {
  createSessionApiV1SessionsPost,
  deleteSessionApiV1SessionsSessionIdDelete,
  updateSessionApiV1SessionsSessionIdPatch,
} from '../../core/api/generated/sessions/sessions'
import type { SessionDTO } from '../../core/api/generated/models'
import { assertData, queryKeys } from '../../core/queryKeys'
import { setLastSessionId } from './sessionStorage'

function patchSessionsCache(
  queryClient: ReturnType<typeof useQueryClient>,
  updater: (sessions: SessionDTO[]) => SessionDTO[],
) {
  for (const status of ['active', 'archived', 'all'] as const) {
    const key = queryKeys.sessions(status === 'all' ? undefined : status)
    queryClient.setQueryData<SessionDTO[]>(key, (old) => (old ? updater(old) : old))
  }
}

export function useCreateSession() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: async () => {
      const response = await createSessionApiV1SessionsPost({ title: 'Новая консультация' })
      return assertData<SessionDTO>(response.data)
    },
    onSuccess: (session) => {
      void queryClient.invalidateQueries({ queryKey: ['sessions'] })
      setLastSessionId(session.session_id)
      navigate(`/chat/${session.session_id}`)
    },
  })
}

export function useRenameSession() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ sessionId, title }: { sessionId: string; title: string }) => {
      const response = await updateSessionApiV1SessionsSessionIdPatch(sessionId, { title })
      return assertData<SessionDTO>(response.data)
    },
    onMutate: async ({ sessionId, title }) => {
      await queryClient.cancelQueries({ queryKey: ['sessions'] })
      const previous = queryClient.getQueriesData<SessionDTO[]>({ queryKey: ['sessions'] })
      patchSessionsCache(queryClient, (sessions) =>
        sessions.map((s) => (s.session_id === sessionId ? { ...s, title } : s)),
      )
      return { previous }
    },
    onError: (_err, _vars, context) => {
      context?.previous?.forEach(([key, data]) => queryClient.setQueryData(key, data))
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: ['sessions'] })
    },
  })
}

export function useArchiveSession() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ sessionId, archived }: { sessionId: string; archived: boolean }) => {
      const response = await updateSessionApiV1SessionsSessionIdPatch(sessionId, {
        status: archived ? 'archived' : 'active',
      })
      return assertData<SessionDTO>(response.data)
    },
    onMutate: async ({ sessionId, archived }) => {
      await queryClient.cancelQueries({ queryKey: ['sessions'] })
      const previous = queryClient.getQueriesData<SessionDTO[]>({ queryKey: ['sessions'] })
      const status = archived ? 'archived' : 'active'
      patchSessionsCache(queryClient, (sessions) =>
        sessions.map((s) => (s.session_id === sessionId ? { ...s, status } : s)),
      )
      return { previous }
    },
    onError: (_err, _vars, context) => {
      context?.previous?.forEach(([key, data]) => queryClient.setQueryData(key, data))
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: ['sessions'] })
    },
  })
}

export function useDeleteSession() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: async (sessionId: string) => {
      await deleteSessionApiV1SessionsSessionIdDelete(sessionId)
      return sessionId
    },
    onMutate: async (sessionId) => {
      await queryClient.cancelQueries({ queryKey: ['sessions'] })
      const previous = queryClient.getQueriesData<SessionDTO[]>({ queryKey: ['sessions'] })
      patchSessionsCache(queryClient, (sessions) =>
        sessions.filter((s) => s.session_id !== sessionId),
      )
      return { previous }
    },
    onError: (_err, _vars, context) => {
      context?.previous?.forEach(([key, data]) => queryClient.setQueryData(key, data))
    },
    onSuccess: () => {
      navigate('/chat')
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: ['sessions'] })
    },
  })
}
