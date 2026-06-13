import { useEffect, useState } from 'react'
import { gameClockService } from '../GameClockService'
import { activityRuntimeService } from '../ActivityRuntimeService'

type ProgressState = {
  progress: number
  remainingMs: number
  isComplete: boolean
}

export function useActivityProgress(
  characterId: string,
  activityId: string
) {
  const [state, setState] = useState<ProgressState>({
    progress: 0,
    remainingMs: 0,
    isComplete: false,
  })

  useEffect(() => {
    if (!characterId || !activityId) return

    const unsub = gameClockService.subscribe((now) => {
      const bucket = activityRuntimeService['getBucket']?.(characterId)
      const activity = bucket?.get(activityId)

      if (!activity || !activity.duration) {
        setState({ progress: 0, remainingMs: 0, isComplete: false })
        return
      }

      const elapsed = now - activity.startedAt
      const progress = Math.min(elapsed / activity.duration, 1)

      setState({
        progress,
        remainingMs: Math.max(activity.duration - elapsed, 0),
        isComplete: progress >= 1,
      })
    })

    return unsub
  }, [characterId, activityId])

  return state
}