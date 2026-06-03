import { DateTime } from 'luxon'
import { useMemo } from 'react'

export interface UseQuestTimerProps {
  startDate?: string
  timeMinutes?: number
  now: number
}

export function useQuestTimer({
  startDate,
  timeMinutes,
  now,
}: UseQuestTimerProps) {

  return useMemo(() => {
    if (!startDate || !timeMinutes) {
      return {
        isActive: false,
        isComplete: false,
        progressPercent: 0,
        leftMinutes: 0,
        leftSeconds: 0,
      }
    }

    const startMillis =
      DateTime.fromISO(startDate)
        .toMillis()

    const totalMillis =
      timeMinutes * 60 * 1000

    const elapsedMillis =
      now - startMillis

    const remainingMillis =
      Math.max(
        0,
        totalMillis - elapsedMillis
      )

    const progressPercent =
      Math.min(
        100,
        (elapsedMillis / totalMillis) * 100
      )

    return {
      isActive:
        remainingMillis > 0,

      isComplete:
        remainingMillis <= 0,

      progressPercent,

      leftMinutes:
        remainingMillis /
        1000 /
        60,

      leftSeconds:
        remainingMillis /
        1000,
    }
  }, [
    startDate,
    timeMinutes,
    now,
  ])
}