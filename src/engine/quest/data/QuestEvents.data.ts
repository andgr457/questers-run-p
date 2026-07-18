import type { GameEventType } from '../../event/types/EventBus.types';

export const GAME_EVENT_BUS_QUEST_TYPES: GameEventType[] = [
  'quest:start',
  'quest:started',
  'quest:complete',
  'quest:completed',
]
