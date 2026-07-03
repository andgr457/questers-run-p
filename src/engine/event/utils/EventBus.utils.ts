import type { GameEventType } from '../types/EventBus.types';

export const GAME_EVENT_BUS_TYPES: GameEventType[] = [
  'player:save',
  'player:saved',
  'player:gold',
  'player:xp',
  'character:save',
  'character:saved',
  
]

export const GAME_EVENT_BUS_PLAYER_TYPES: GameEventType[] = [
  'player:save',
  'player:saved',
  'player:gold',
  'player:gold:added',
  'player:xp',
  'player:xp:added',
  'player:level',
  'player:token',
  'player:token:added',
]

export const GAME_EVENT_BUS_DEBUG_RECORDING_TYPES: GameEventType[] = [
  'event:debug:recording:start',
  'event:debug:recording:started',
  'event:debug:recording:stop',
  'event:debug:recording:stopped',
  'event:debug:recording:history',
  'event:debug:mode'
]

export const GAME_EVENT_BUS_CHARACTER_TYPES: GameEventType[] = [
  'character:save',
  'character:saved',
  'character:gold',
  'character:gold:added',
  'character:xp',
  'character:xp:added',
  'character:level',
  'character:manage'
]