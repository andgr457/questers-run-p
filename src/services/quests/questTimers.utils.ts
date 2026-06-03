import { DateTime } from 'luxon'

export interface QuestTimerResult {
  totalTimeHours: number
  totalTimeMinutes: number
  totalTimeSeconds: number

  timeLeftHours: number
  timeLeftMinutes: number
  timeLeftSeconds: number
}

export function getQuestTimeLeft(
  totalMinutes: number,
  startTime: DateTime | string
): QuestTimerResult {

  const start =
    typeof startTime === 'string'
      ? DateTime.fromISO(startTime)
      : startTime

  const end = start.plus({
    minutes: totalMinutes
  })

  const now = DateTime.now()

  const timeLeftSeconds = Math.max(
    0,
    Math.round(
      end.diff(now, 'seconds').seconds
    )
  )

  const totalSeconds = Math.round(
    totalMinutes * 60
  )

  return {
    totalTimeHours: Math.floor(
      totalMinutes / 60
    ),

    totalTimeMinutes: totalMinutes,

    totalTimeSeconds: totalSeconds,

    timeLeftHours:
      timeLeftSeconds / 3600,

    timeLeftMinutes:
      (timeLeftSeconds % 3600) / 60,

    timeLeftSeconds,
  }
}

export function isQuestTimerComplete(
  totalMinutes: number,
  startTime: DateTime | string
) {
  return (
    getQuestTimeLeft(
      totalMinutes,
      startTime
    ).timeLeftSeconds <= 0
  )
}