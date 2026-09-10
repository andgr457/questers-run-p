import { clockRuntimeService } from '../../../../engine/clock/ClockRuntimeService';
import type { GameEvent } from '../../../../engine/events/types/EventBus.types';
import type { WorldModeMain } from '../../../../engine/events/types/WorldModeEvents.types';

export function getWorldModeMainChangeEvent(
  mode: WorldModeMain
): GameEvent {
  return {
    id: crypto.randomUUID(),
    type: 'world:mode:main:change',
    created: clockRuntimeService.getNow(),
    meta: {
      mode
    }
  }
}
