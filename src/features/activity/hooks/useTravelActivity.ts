import { useEffect, useState } from 'react'
import { gameClockService } from '../../../game/engine/clock/GameClockService'
import { activityRuntimeService } from '../activityRuntimeService'

export function useTravelActivity(characterId: string | null) {
  const [activity, setActivity] = useState<any>(null)
  const [now, setNow] = useState(gameClockService.getNow())

  useEffect(() => {
    if (!characterId) return

    const unsubClock = gameClockService.subscribe((n) => setNow(n))

    const unsubActivity = activityRuntimeService.subscribe(
      () => activityRuntimeService.getActive(characterId).find(a => a.type === 'travel'),
      (a) => setActivity(a)
    )

    return () => {
      unsubClock()
      unsubActivity()
    }
  }, [characterId])

  if (!activity) return null

  const progress = activityRuntimeService.getProgress(
    characterId!,
    activity.id,
    now
  )

  return {
    activity,
    progress,
    to: activity.meta?.travel?.to,
    duration: activity.duration,
  }
}