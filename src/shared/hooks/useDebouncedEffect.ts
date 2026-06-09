import { useEffect, useRef } from 'react'

export function useDebouncedEffect(
  effect: () => void,
  deps: [sessionId: string, text: string],
  delayMs: number,
) {
  const effectRef = useRef(effect)

  useEffect(() => {
    effectRef.current = effect
  }, [effect])

  useEffect(() => {
    const timer = window.setTimeout(() => effectRef.current(), delayMs)
    return () => window.clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- debounce specific tuple
  }, [delayMs, deps[0], deps[1]])
}
