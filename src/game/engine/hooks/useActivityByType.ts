import { useEffect, useState } from 'react'
import { activityRuntimeService } from '../activityRuntimeService'
import type { ActivityEntry, ActivityType } from '../../../activity/types'

export function useActivityByType(
  characterId: string,
  type: ActivityType
) {
  const [activity, setActivity] = useState<ActivityEntry | undefined>()

  useEffect(() => {
    if (!characterId) return

    return activityRuntimeService.subscribe(
      () => activityRuntimeService.getByType(characterId, type),
      setActivity
    )
  }, [characterId, type])

  return activity
}