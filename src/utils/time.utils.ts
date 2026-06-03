export interface TimeWindow {
  startedAt: number
  durationMs: number
}

export function getTimeRemaining(
  timer: TimeWindow,
  now = Date.now()
) {
  return Math.max(
    0,
    timer.durationMs - (now - timer.startedAt)
  )
}

export function isTimeComplete(
  timer: TimeWindow,
  now = Date.now()
) {
  return getTimeRemaining(timer, now) <= 0
}

export function getElapsedTime(
  timer: TimeWindow,
  now = Date.now()
) {
  return Math.max(0, now - timer.startedAt)
}