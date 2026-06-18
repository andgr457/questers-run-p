import { useEffect, useState } from 'react'

import { activityRuntimeService } from '../ActivityRuntimeService'
import { formatTimeRemaining } from '../../clock/utils/formatTimeRemaining'
import { gameClockService } from '../../clock/GameClockService'

type Result = {
  progress: number
  remainingMs: number
  label: string
  isComplete: boolean
}

export function useActivityTime(
  characterId?: string,
  activityId?: string
): Result | null {
  const [, setTick] = useState(0)

  useEffect(() => {
    if (!characterId || !activityId) return

    const interval = setInterval(() => {
      setTick(t => t + 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [characterId, activityId])

  if (!characterId || !activityId) return null

  const activity = activityRuntimeService
    .getActive(characterId)
    ?.find(a => a.id === activityId)

  if (!activity) {
    return {
      progress: 0,
      remainingMs: 0,
      label: '0s',
      isComplete: true
    }
  }

  const now = gameClockService.getNow()

  const elapsed = now - activity.startedAt
  const progress = Math.min(elapsed / activity.duration, 1)

  const remainingMs = Math.max(activity.duration - elapsed, 0)

  return {
    progress,
    remainingMs,
    label: formatTimeRemaining(remainingMs),
    isComplete: progress >= 1
  }
}