import type { ActionDetail } from '../../../../core/components/form/Actions'
import { eventBus } from '../../../../engine/events/EventBus'
import { getWorldModeMainChangeEvent } from '../utils/WorldActions.utils'

export const WORLD_ACTION_SETTINGS: ActionDetail = {
  id: 'world_action_settings',
  mode: 'settings',
  inactive: false,
  onClick: () => {
    eventBus.emit(
      getWorldModeMainChangeEvent(
        'settings'
      )
    )
  },
  text: 'Settings',
}