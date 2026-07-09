import type { NotificationEventAddMeta } from '../../../game/notification/types/Notification.types'
import type { GameEvent } from '../../event/types/EventBus.types'

export type NotificationEventTypes = 'notification:save'
  | 'notification:saved'
  | 'notification:viewed'

interface GameEvent_NotificationSave extends GameEvent {
  type: 'notification:save'
  meta: {
    notification: NotificationEventAddMeta
  }
}

interface GameEvent_NotificationSaved extends GameEvent {
  type: 'notification:saved'
  meta: {
    notification: NotificationEventAddMeta
  }
}

interface GameEvent_NotificationViewed extends GameEvent {
  type: 'notification:viewed'
  meta: {
    notificationId: string
  }
}

export type NotificationEvents = GameEvent_NotificationSave
  | GameEvent_NotificationSaved
  | GameEvent_NotificationViewed
