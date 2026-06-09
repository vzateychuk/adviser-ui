const LAST_SESSION_KEY = 'med-adviser:last-session-id'
const draftKey = (sessionId: string) => `med-adviser:draft:${sessionId}`

export function getLastSessionId(): string | null {
  return localStorage.getItem(LAST_SESSION_KEY)
}

export function setLastSessionId(sessionId: string) {
  localStorage.setItem(LAST_SESSION_KEY, sessionId)
}

export function getDraft(sessionId: string): string {
  return localStorage.getItem(draftKey(sessionId)) ?? ''
}

export function setDraft(sessionId: string, text: string) {
  if (text.trim()) {
    localStorage.setItem(draftKey(sessionId), text)
  } else {
    localStorage.removeItem(draftKey(sessionId))
  }
}

export function clearDraft(sessionId: string) {
  localStorage.removeItem(draftKey(sessionId))
}
