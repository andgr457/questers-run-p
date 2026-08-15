import { DateTime } from 'luxon'
const GAME_DATE_TIME_FORMAT = 'M/d/yy t'
export function formatTimeRemaining(totalMs: number): string {
  if (totalMs <= 0) return '0s'

  // convert once
  const totalSeconds = Math.floor(totalMs / 1000)

  const secondsInMinute = 60
  const secondsInHour = 60 * 60
  const secondsInDay = 24 * 60 * 60

  const days = Math.floor(totalSeconds / secondsInDay)
  const afterDays = totalSeconds - days * secondsInDay

  const hours = Math.floor(afterDays / secondsInHour)
  const afterHours = afterDays - hours * secondsInHour

  const minutes = Math.floor(afterHours / secondsInMinute)
  const seconds = afterHours - minutes * secondsInMinute

  const parts: string[] = []

  if (days > 0) parts.push(`${days}d`)
  if (hours > 0) parts.push(`${hours}h`)
  if (minutes > 0) parts.push(`${minutes}m`)
  if (seconds > 0 || parts.length === 0) parts.push(`${seconds}s`)

  return parts.join(' ')
}

export function formatDateFromMillis(ms: number): string {
  return DateTime.fromMillis(ms).toFormat(GAME_DATE_TIME_FORMAT)
}

export const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
