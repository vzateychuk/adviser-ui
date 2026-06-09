import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ChatThread } from './ChatThread'
import { SessionSidebar } from './SessionSidebar'
import { getLastSessionId, setLastSessionId } from './sessionStorage'
import { useSessions } from './useSessions'

export function ChatPage() {
  const { sessionId: routeSessionId } = useParams()
  const navigate = useNavigate()
  const [filter, setFilter] = useState<'active' | 'archived'>('active')
  const { data: activeSessions } = useSessions('active')

  useEffect(() => {
    if (routeSessionId) {
      setLastSessionId(routeSessionId)
      return
    }

    const last = getLastSessionId()
    if (last) {
      navigate(`/chat/${last}`, { replace: true })
      return
    }

    const first = activeSessions?.[0]
    if (first) {
      navigate(`/chat/${first.session_id}`, { replace: true })
    }
  }, [routeSessionId, activeSessions, navigate])

  function handleSelectSession(id: string) {
    setLastSessionId(id)
    navigate(`/chat/${id}`)
  }

  return (
    <div className="flex h-[calc(100vh-4.5rem)] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <SessionSidebar
        activeSessionId={routeSessionId}
        filter={filter}
        onFilterChange={setFilter}
        onSelectSession={handleSelectSession}
      />
      <ChatThread sessionId={routeSessionId} />
    </div>
  )
}
