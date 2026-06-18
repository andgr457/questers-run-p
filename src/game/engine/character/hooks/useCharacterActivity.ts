import { useEffect, useState } from 'react'
import { activityRuntimeService } from '../../activity/ActivityRuntimeService'
import { gameEventBus } from '../../event-bus/GameEventBus'

export function useCharacterActivity(characterId: string) {
  const [, setTick] = useState(0)

  useEffect(() => {
    const unsub1 = activityRuntimeService.subscribe(() => {
      setTick(v => v + 1)
    })

    const unsub2 = gameEventBus.subscribe(event => {
      if (
        event.characterId === characterId &&
        (event.type.startsWith('activity:') || event.type.startsWith('quest:'))
      ) {
        setTick(v => v + 1)
      }
    })

    return () => {
      unsub1()
      unsub2()
    }
  }, [characterId])

  const activity = activityRuntimeService.getActive(characterId)?.[0]
  const progress = activity
    ? activityRuntimeService.getProgress(characterId, activity.id)
    : 0

  return {
    activity,
    progress,
    isActive: !!activity,
    type: activity?.type
  }
}