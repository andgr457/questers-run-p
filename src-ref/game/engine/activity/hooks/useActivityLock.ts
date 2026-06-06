import { useEffect, useState } from 'react'
import { activityRuntimeService } from '../activityRuntimeService'

export function useActivityLock(characterId: string) {
  const [locked, setLocked] = useState(false)

  useEffect(() => {
    return activityRuntimeService.subscribe(
      () => activityRuntimeService.isLocked(characterId),
      setLocked
    )
  }, [characterId])

  return locked
}