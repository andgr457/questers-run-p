import { useEffect, useState } from 'react'
import { activityRuntimeService } from './activityRunetimeService'

export function useActivityLock(characterId?: string) {
  const [locked, setLocked] = useState(false)

  useEffect(() => {
    if (!characterId) return

    return activityRuntimeService.subscribe(() => {
      setLocked(
        activityRuntimeService.isLocked(characterId)
      )
    })
  }, [characterId])

  return locked
}