import { useEffect, useState } from 'react'
import { activityRuntimeService } from '../activityRuntimeService'

export function useActivities(characterId: string | null) {
  const [activities, setActivities] = useState(
    characterId
      ? activityRuntimeService.getAll(characterId)
      : []
  )

  useEffect(() => {
    if (!characterId) return

    const unsub = activityRuntimeService.subscribe(
      () => activityRuntimeService.getAll(characterId),
      (next) => {
        setActivities(next)
      }
    )

    return unsub
  }, [characterId])

  return activities
}