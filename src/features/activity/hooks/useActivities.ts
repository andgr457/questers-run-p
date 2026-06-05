import { useEffect, useState } from 'react'
import { activityRuntimeService } from '../activityRuntimeService'
import type { ActivityEntry } from '../types'

export function useActivities(characterId: string) {
  const [activities, setActivities] = useState<ActivityEntry[]>([])

  useEffect(() => {
  return activityRuntimeService.subscribe(
    () => activityRuntimeService.getAll(characterId),
    setActivities
  )
}, [characterId])

  return activities
}