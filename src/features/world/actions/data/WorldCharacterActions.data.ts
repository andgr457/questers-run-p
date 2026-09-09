import type { ActionDetail } from '../../../../core/components/form/Actions'
import { eventBus } from '../../../../engine/events/EventBus'
import { getWorldModeMainChangeEvent } from '../utils/WorldActions.utils'

//first time load action
export const WORLD_ACTION_SUMMON_CHARACTER: ActionDetail = {
  id: 'world_action_character_create',
  mode: 'character:create',
  inactive: false,
  onClick: () => {
    eventBus.emit(
      getWorldModeMainChangeEvent(
        'character:create'
      )
    )
  },
  text: 'Member Summon',
}

export const WORLD_ACTION_CHARACTER_LIST: ActionDetail = {
  id: 'world_action_character_list',
  mode: 'character:list',
  inactive: false,
  onClick: () => {
    eventBus.emit(
      getWorldModeMainChangeEvent(
        'character:list'
      )
    )
  },
  text: 'Characters',
}

export const WORLD_ACTION_CHARACTER_DETAIL: ActionDetail = {
  id: 'world_action_character_detail',
  mode: 'character:detail',
  inactive: false,
  onClick: () => {
    eventBus.emit(
      getWorldModeMainChangeEvent(
        'character:detail'
      )
    )
  },
  text: 'Character Detail',
}

export const WORLD_ACTION_CHARACTER_UPGRADES: ActionDetail = {
  id: 'world_action_character_upgrades',
  mode: 'character:upgrades',
  inactive: false,
  onClick: () => {
    eventBus.emit(
      getWorldModeMainChangeEvent(
        'character:upgrades'
      )
    )
  },
  text: 'Character Upgrades',
}

export const WORLD_ACTIONS_CHARACTER_ALL: ActionDetail[] = [
  {...WORLD_ACTION_CHARACTER_LIST},
  {...WORLD_ACTION_CHARACTER_DETAIL},
  {...WORLD_ACTION_CHARACTER_UPGRADES},
]
