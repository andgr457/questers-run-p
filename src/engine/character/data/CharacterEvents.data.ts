import type { GameEventType } from '../../event/types/EventBus.types';


export const GAME_EVENT_BUS_CHARACTER_TYPES: GameEventType[] = [
  'character:save',
  'character:saved',
  'character:gold',
  'character:gold:added',
  'character:xp',
  'character:xp:added',
  'character:level',
  'character:manage',
  'character:manage:added'
];
