import type { GameEvent, GameEventType } from '../../../../engine/event/types/EventBus.types';

export const GAME_DEBUG_EVENT_DEFAULTS: Partial<Record<GameEventType, GameEvent>> = {
  'player:save': {
    id: '',
    type: 'player:save',
    meta: {
      player: {
        id: '',
        characterTokens: 1,
        gold: 0,
        level: 1,
        name: 'debug-player',
        xp: 0,
        xpNextLevel: 100,
      }
    }
  },
  'player:saved': {
    id: '',
    parentEventId: '',
    type: 'player:saved',
    meta: {
      player: {
        id: '',
        characterTokens: 1,
        gold: 0,
        level: 1,
        name: 'debug-player',
        xp: 0,
        xpNextLevel: 100,
      }
    }
  },
}

