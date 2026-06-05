import { useEffect, useMemo, useState } from 'react'

import { gameClockService } from '../../../game/engine/clock/GameClockService'
import { activityRuntimeService } from '../activityRuntimeService'

import type { WorldLocation } from '../../../game/world/worldState'
import { findRoute, type RouteResult } from '../../../game/world/worldRouting'
import type { ActivityEntry } from '../types'

export function useTravelActivity(characterId: string | null) {
  const [activity, setActivity] = useState<ActivityEntry | null>(null)
  const [now, setNow] = useState(gameClockService.getNow())

  useEffect(() => {
    if (!characterId) return

    const unsubClock = gameClockService.subscribe(setNow)

    const unsubActivity = activityRuntimeService.subscribe(
      () =>
        activityRuntimeService
          .getActive(characterId)
          .find(a => a.type === 'travel') ?? null,
      (a) => setActivity(a)
    )

    return () => {
      unsubClock()
      unsubActivity()
    }
  }, [characterId])

  const progress = useMemo(() => {
    if (!activity || !characterId) return 0

    return activityRuntimeService.getProgress(
      characterId,
      activity.id,
      now
    )
  }, [activity, characterId, now])

  const route = useMemo<RouteResult | null>(() => {
    if (!activity) return null

    const from = activity.meta?.travel?.from as WorldLocation | undefined
    const to = activity.meta?.travel?.to as WorldLocation | undefined

    if (!from || !to) return null

    return findRoute(from, to)
  }, [activity])

  const elapsedMs = activity
    ? Math.min(now - activity.startedAt, activity.duration)
    : 0

  const remainingMs = activity
    ? Math.max(activity.duration - elapsedMs, 0)
    : 0

  const current = useMemo(() => {
    if (!route) return null

    let acc = 0

    for (const step of route.steps) {
      acc += step.travelMs

      if (elapsedMs <= acc) {
        return step.from
      }
    }

    return route.steps.at(-1)?.to ?? null
  }, [route, elapsedMs])

  if (!activity) return null

  return {
    activity,
    progress,
    route,
    current,
    from: activity.meta?.travel?.from ?? null,
    to: activity.meta?.travel?.to ?? null,
    duration: activity.duration,
    elapsedMs,
    remainingMs,
  }
}