import { useTravelActivity } from '../../../../features/activity/hooks/useTravelActivity'

export function useWorldTravelMap(characterId: string | null) {
  const travel = useTravelActivity(characterId)

  if (!travel?.route) {
    return null
  }

  const elapsed = travel.elapsedMs
  const total = travel.duration ?? 1

  const progress = Math.min(elapsed / total, 1)

  let currentIndex = 0
  let acc = 0

  for (let i = 0; i < travel.route.steps.length; i++) {
    acc += travel.route.steps[i].travelMs
    if (elapsed <= acc) {
      currentIndex = i
      break
    }
  }

  return {
    route: travel.route,
    progress,
    currentIndex,
    currentLocation: travel.current,
  }
}