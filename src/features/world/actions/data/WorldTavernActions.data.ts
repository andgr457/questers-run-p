import type { ActionDetail } from '../../../../core/components/form/Actions'
import { eventBus } from '../../../../engine/events/EventBus'
import { getWorldModeMainChangeEvent } from '../utils/WorldActions.utils'

export const WORLD_ACTION_TAVERN_HALL: ActionDetail = {
  id: 'world_action_taverm_hall',
  mode: 'tavern:hall',
  inactive: false,
  onClick: () => {
    eventBus.emit(
      getWorldModeMainChangeEvent(
        'tavern:hall'
      )
    )
  },
  text: 'Tavern',
}