import type { DocumentDTO, MessageDTO, ProfileDTO, SessionDTO } from './api/generated/models'

export const queryKeys = {
  sessions: (status?: string) => ['sessions', status ?? 'all'] as const,
  messages: (sessionId: string) => ['messages', sessionId] as const,
  documents: ['documents'] as const,
  profile: ['profile'] as const,
}

/** Orval unions include error payloads; customFetch throws before returning them. */
export function assertData<T>(data: unknown): T {
  return data as T
}

export type { DocumentDTO, MessageDTO, ProfileDTO, SessionDTO }
