import type { ActionDetail } from '../../../../core/components/form/Actions'
import { clockRuntimeService } from '../../../../engine/clock/ClockRuntimeService'
import { eventBus } from '../../../../engine/events/EventBus'
import { getWorldModeMainChangeEvent } from '../utils/WorldActions.utils'

export const WORLD_ACTION_TOWN_HALL: ActionDetail = {
  id: 'world_action_town_hall',
  mode: 'town:hall',
  inactive: false,
  onClick: () => {
    eventBus.emit(
      getWorldModeMainChangeEvent(
        'town:hall'
      )
    )
  },
  text: 'Town Hall',
}