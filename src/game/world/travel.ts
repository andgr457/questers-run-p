import { activityRuntimeService } from '../../features/activity/activityRuntimeService'
import { gameClockService } from '../engine/clock/GameClockService'
import { type WorldLocation } from './worldState'

type TravelOptions = {
  characterId: string
  to: WorldLocation
  duration?: number
  blocking?: boolean
}

export function travel({
  characterId,
  to,
  duration = 5000,
  blocking = false,
}: TravelOptions) {
  const now = gameClockService.getNow()

  activityRuntimeService.start({
    id: crypto.randomUUID(),
    characterId,
    type: 'travel',
    startedAt: now,
    duration,
    status: 'active',
    blocking,
    meta: {
      travel: {
        to
      },
    },
  })
}