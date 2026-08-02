import { useEffect, useState } from 'react'
import { eventBus } from '../../event/EventBus'
import { activityRuntimeService, type ActivityRuntimeEntity } from '../ActivityRuntimeService'

const ACTIVITY_EVENTS = [
  'activity:started',
  'activity:stopped',
  'activity:progress',
  'activity:completed'
]

export function useActivity() {
  const [activities, setActivities] = useState<ActivityRuntimeEntity[]>(
    activityRuntimeService.getActivities()
  )

  useEffect(() => {
    const unsub = eventBus.subscribe(event => {
      if (!ACTIVITY_EVENTS.includes(event.type)) {
        return
      }

      setActivities(activityRuntimeService.getActivities())
    })

    return unsub
  }, [])

  return {
    activities,
    getActivity(characterId: string) {
      return activities.find(activity => activity.characterId === characterId)
    },
    isRunning(characterId: string) {
      return activities.some(activity => activity.characterId === characterId)
    }
  }
}