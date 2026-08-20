import { clockRuntimeService } from '../../engine/clock/ClockRuntimeService'
import { eventBus } from '../../engine/events/EventBus'
import type { WorldModeMain } from '../../engine/events/types/WorldModeEvents.types'

export function transitionTo(transitionText: string, transitionOnCompleteMode: WorldModeMain) {
  eventBus.emit({
    id: crypto.randomUUID(),
    type: 'world:mode:main:change',
    created: clockRuntimeService.getNow(),
    meta: {
      mode: 'none'
    }
  })
  eventBus.emit({
    id: crypto.randomUUID(),
    type: 'world:mode:overlay:change',
    created: clockRuntimeService.getNow(),
    meta: {
      mode: 'mode-change',
      transitionOnCompleteMode,
      transitionText
    }
  })
}