import type { GameEvent, GameEventType } from '../../../../engine/event/types/EventBus.types';

export const GAME_DEBUG_EVENT_DEFAULTS: Partial<Record<GameEventType, GameEvent>> = {
  'player:save': {
    id: '',
    type: 'player:save',
    meta: {
      player: {
        id: '',
        characterTokens: 1,
        level: 1,
        name: 'debug-player',
        xp: 0,
        xpNextLevel: 100,
      }
    }
  },
  'player:gold': {
    id: '',
    type: 'player:gold',
    meta: {
      playerGoldTransaction: {
        id: '',
        amount: 1,
        date: 0,
      }
    }
  },
  'player:xp': {
    id: '',
    type: 'player:xp',
    meta: {
      xp: 0
    }
  }
}

