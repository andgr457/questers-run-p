import type { GameEventType } from '../../event/types/EventBus.types';

export const GAME_EVENT_BUS_NOTIFICATION_TYPES: GameEventType[] = [
  'notification:save',
  'notification:saved',
  'notification:viewed',
]
