import { useEffect, useState } from 'react'
import { gameClockService } from '../core/time/GameClockService'

export function useGameClock() {
  const [now, setNow] = useState(
    gameClockService.getNow()
  )

  useEffect(() => {
    return gameClockService.subscribe(setNow)
  }, [])

  return now
}