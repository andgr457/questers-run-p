import type { ActionDetail } from '../../../../core/components/form/Actions'
import { eventBus } from '../../../../engine/events/EventBus'
import { getWorldModeMainChangeEvent } from '../utils/WorldActions.utils'

//first time load action after character created
export const WORLD_ACTION_REGISTER_GUILD: ActionDetail = {
  id: 'world_action_guild_create',
  mode: 'guild:create',
  inactive: false,
  onClick: () => {
    eventBus.emit(
      getWorldModeMainChangeEvent(
        'guild:create'
      )
    )
  },
  text: 'Guild Registration',
}

export const WORLD_ACTION_GUILD_LIST: ActionDetail = {
  id: 'world_action_guild_list',
  mode: 'guild:list',
  inactive: false,
  onClick: () => {
    eventBus.emit(
      getWorldModeMainChangeEvent(
        'guild:list'
      )
    )
  },
  text: 'Guilds',
}

export const WORLD_ACTION_GUILD_HALL: ActionDetail = {
  id: 'world_action_guild_hall',
  mode: 'guild:hall',
  inactive: false,
  onClick: () => {
    eventBus.emit(
      getWorldModeMainChangeEvent(
        'guild:hall'
      )
    )
  },
  text: 'Guild Hall',
}

export const WORLD_ACTION_GUILD_UPGRADES: ActionDetail = {
  id: 'world_action_guild_upgrades',
  mode: 'guild:upgrades',
  inactive: false,
  onClick: () => {
    eventBus.emit(
      getWorldModeMainChangeEvent(
        'guild:upgrades'
      )
    )
  },
  text: 'Guild Upgrades',
}

export const WORLD_ACTIONS_GUILD_ALL: ActionDetail[] = [
  {...WORLD_ACTION_GUILD_LIST},
  {...WORLD_ACTION_GUILD_HALL},
  {...WORLD_ACTION_GUILD_UPGRADES},
]