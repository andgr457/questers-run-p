import type { GameEventType } from '../../event/types/EventBus.types';

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
];
