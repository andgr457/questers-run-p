import type { AppMode } from '../../app/App'
import { activityRuntimeService } from '../../features/activity/activityRuntimeService'
import { gameClockService } from '../engine/clock/GameClockService'
import { findRoute } from '../world/worldRouting'
import type { WorldLocation } from '../world/worldState'

type TravelParams = {
  characterId: string
  from: WorldLocation
  to: WorldLocation
  setState: (updater: any) => void
  afterMode?: AppMode
}

export function travelTo({
  characterId,
  from,
  to,
  setState,
}: TravelParams) {
  const route = findRoute(from, to)
  if (!route) return

  // 1. switch UI immediately into travel mode
  setState((prev: any) => ({
    ...prev,
    mode: 'travel',
    characterId,
    location: from,
  }))

  // 2. start engine activity
  activityRuntimeService.start({
    id: crypto.randomUUID(),
    characterId,
    type: 'travel',
    startedAt: gameClockService.getNow(),
    duration: route.totalMs,
    status: 'active',
    blocking: true,
    meta: {
      travel: {
        from,
        to,
        route,
      },
    },
  })

  // 3. optional: return route for chaining logic
  return route
}