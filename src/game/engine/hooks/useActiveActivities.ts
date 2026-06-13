import { useEffect, useState } from 'react'
import type { ActivityEntry } from '../types/Activity.types'
import { activityRuntimeService } from '../ActivityRuntimeService'

export function useActiveActivities(characterId: string) {
  const [active, setActive] = useState<ActivityEntry[]>([])

  useEffect(() => {
  return activityRuntimeService.subscribe(
    () => activityRuntimeService.getActive(characterId),
    setActive
  )
}, [characterId])

  return active
}