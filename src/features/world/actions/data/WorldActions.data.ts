import type { ActionDetail } from '../../../../core/components/form/Actions';
import { eventBus } from '../../../../engine/events/EventBus';
import { getWorldModeMainChangeEvent } from '../utils/WorldActions.utils';

export const WORLD_ACTION_NONE: ActionDetail = {
  id: 'world_action_none',
  mode: 'none',
  inactive: false,
  onClick: () => {
    eventBus.emit(
      getWorldModeMainChangeEvent(
        'none'
      )
    )
  },
  text: 'Town',
}




