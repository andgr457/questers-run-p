import { useEffect, useState } from 'react'
import { activityRuntimeService } from '../activityRuntimeService'
import type { ActivityEntry } from '../types'

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