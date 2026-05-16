import { useCallback, useState } from 'react'

export function useSpinner(initial = false) {
  const [loading, setLoading] = useState(initial)

  const start = useCallback(() => {
    setLoading(true)
  }, [])

  const stop = useCallback(() => {
    setLoading(false)
  }, [])

  const withSpinner = useCallback(
    async <T>(fn: () => Promise<T>): Promise<T> => {
      try {
        setLoading(true)
        return await fn()
      } finally {
        setLoading(false)
      }
    },
    []
  )

  return {
    loading,
    setLoading,
    start,
    stop,
    withSpinner,
  }
}