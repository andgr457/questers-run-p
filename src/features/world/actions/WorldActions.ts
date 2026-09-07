import type { ActionDetail } from '../../../core/components/form/Actions';
import { clockRuntimeService } from '../../../engine/clock/ClockRuntimeService';
import { eventBus } from '../../../engine/events/EventBus';

export const WORLD_ACTION_NONE: ActionDetail = {
  inactive: false,
  onClick: () => {
    eventBus.emit({
      id: crypto.randomUUID(),
      type: 'world:mode:main:change',
      created: clockRuntimeService.getNow(),
      meta: {
        mode: 'none'
      }
    })
  },
  text: 'Home',
}

export const WORLD_ACTION_SETTINGS: ActionDetail = {
  inactive: false,
  onClick: () => {
    eventBus.emit({
      id: crypto.randomUUID(),
      type: 'world:mode:main:change',
      created: clockRuntimeService.getNow(),
      meta: {
        mode: 'settings'
      }
    })
  },
  text: 'Settings',
}

export const WORLD_ACTION_SUMMON_CHARACTER: ActionDetail = {
  inactive: false,
  onClick: () => {
    eventBus.emit({
      id: crypto.randomUUID(),
      type: 'world:mode:main:change',
      created: clockRuntimeService.getNow(),
      meta: {
        mode: 'character:create'
      }
    })
  },
  text: 'Summon Adventurer',
}

export const WORLD_ACTION_REGISTER_GUILD: ActionDetail = {
  inactive: false,
  onClick: () => {
    eventBus.emit({
      id: crypto.randomUUID(),
      type: 'world:mode:main:change',
      created: clockRuntimeService.getNow(),
      meta: {
        mode: 'guild:create'
      }
    })
  },
  text: 'Register Guild',
}

export const WORLD_ACTION_GUILD_HALL: ActionDetail = {
  inactive: false,
  onClick: () => {
    eventBus.emit({
      id: crypto.randomUUID(),
      type: 'world:mode:main:change',
      created: clockRuntimeService.getNow(),
      meta: {
        mode: 'guild:hall'
      }
    })
  },
  text: 'Guild Hall',
}
