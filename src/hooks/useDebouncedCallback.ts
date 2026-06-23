import { useCallback, useEffect, useRef } from 'react'

export function useDebouncedCallback<Args extends unknown[]>(
  callback: (...args: Args) => void,
  delayMs: number,
) {
  const timeoutRef = useRef<number | undefined>(undefined)
  const callbackRef = useRef(callback)

  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  useEffect(() => () => window.clearTimeout(timeoutRef.current), [])

  return useCallback(
    (...args: Args) => {
      window.clearTimeout(timeoutRef.current)
      timeoutRef.current = window.setTimeout(() => callbackRef.current(...args), delayMs)
    },
    [delayMs],
  )
}
