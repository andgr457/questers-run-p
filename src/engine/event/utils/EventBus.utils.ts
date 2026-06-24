import type { GameEventType } from '../types/EventBus.types';

export const GAME_EVENT_BUS_TYPES: GameEventType[] = [
  'player:save',
  'player:saved',
  'character:save',
  'character:saved',
  
]

export const GAME_EVENT_BUS_DEBUG_RECORDING_TYPES: GameEventType[] = [
  'event:debug:recording:start',
  'event:debug:recording:started',
  'event:debug:recording:stop',
  'event:debug:recording:stopped',
  'event:debug:recording:history',
]
