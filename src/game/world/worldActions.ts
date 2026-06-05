import { worldStateStore, type WorldLocation } from './worldState'
import { transitionService } from '../engine/transitions/TransitionService'

export function travelTo(characterId: string, to: WorldLocation) {
  const world = worldStateStore.get(characterId)
  if (!world) return

  const from = world.location

  transitionService.startTransition({
    type: 'travel',
    from,
    to,

    // onMid: () => {
    //   worldStateStore.setLocation(characterId, to)
    // },
  })
}