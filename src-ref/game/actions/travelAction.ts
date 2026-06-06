import { activityRuntimeService } from '../../features/activity/activityRuntimeService'
import { findRoute, type RouteResult } from '../world/worldRouting'
import type { WorldLocation } from '../world/worldState'

export function travelTo({
  from,
  to,
  characterId,
}: {
  from: WorldLocation
  to: WorldLocation
  characterId: string
}) {
  const route = findRoute(from, to)

  const activityId = crypto.randomUUID()

  activityRuntimeService.start({
    id: activityId,
    characterId,
    type: 'travel',
    startedAt: Date.now(),
    duration: route?.totalMs ?? 2000,
    status: 'active',
    blocking: true,
    meta: {
      travel: {
        from,
        to,
        route: route as RouteResult,
      },
    },
  })
}