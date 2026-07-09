import { DateTime } from 'luxon'
import { clockRuntimeService } from '../clock/ClockRuntimeService'
import { GAME_STORAGE_KEYS } from '../data/local-storage/GameStorageKeys.data'
import { eventBus } from '../event/EventBus'
import type { Notification } from '../../game/notification/types/Notification.types'
import type { GameEvent } from '../event/types/EventBus.types'
import { GAME_EVENT_BUS_NOTIFICATION_TYPES } from './data/NotificationEvents.data'

class NotificationRuntimeService {
  private initialized = false
  private notifications: Notification[] = []
  private purgeInterval: number | undefined

  init() {
    if (this.initialized) {
      return
    }

    this.initialized = true
    const historyValue = localStorage.getItem(GAME_STORAGE_KEYS.NOTIFICATIONS_GAME)
    this.notifications = JSON.parse(historyValue ?? '[]')
    this.saveNotifications()
    this.startPurgeTimer()

    eventBus.subscribe(event => {
      if(!GAME_EVENT_BUS_NOTIFICATION_TYPES.includes(event.type)) return

      if(event.type === 'notification:save'){
        this.addNotification(event)
      }
      if(event.type === 'notification:viewed'){
        this.markNotificationViewed(event)
      }
    })
  }

  private startPurgeTimer() {
    if (this.purgeInterval) {
      return
    }

    this.purgeInterval = window.setInterval(() => {
      this.purgeOldNotifications()
    }, 60000)
  }

  private purgeOldNotifications() {
    const hourAgoMs = DateTime.now().minus({hours: 1}).toMillis()
    const purgableHistoryIds = this.notifications.filter(h => 
      h.date < hourAgoMs && h.viewed === true
    ).map(h => h.id)
    this.notifications = this.notifications.filter(
      item => !purgableHistoryIds.includes(item.id)
    )
    this.saveNotifications()
    this.emitNotificationsSaved()
  }

  private saveNotifications() {
    localStorage.setItem(
      GAME_STORAGE_KEYS.NOTIFICATIONS_GAME,
      JSON.stringify(this.notifications)
    )
  }

  private emitNotificationsSaved() {
    eventBus.emit({
      id: crypto.randomUUID(),
      type: 'notification:saved',
    })
  }

  private addNotification(
    event: GameEvent
  ) {
    const notification = event.meta?.notification
    if(!notification){
      return
    }

    this.notifications = [
      {
        id: crypto.randomUUID(),
        date: clockRuntimeService.getNow(),
        title: notification.title,
        description: notification.description,
        viewed: false,
      },
      ...this.notifications,
    ]
    this.saveNotifications()
    this.emitNotificationsSaved()
  }

  private markNotificationViewed(event: GameEvent) {
    const id = event.meta?.notificationId
    if(!id){
      return
    }

    this.notifications = this.notifications.map(item =>
      item.id === id
        ? {
            ...item,
            viewed: true,
          }
        : item
    )

    this.saveNotifications()
    this.emitNotificationsSaved()
  }

  getNotifications() {
    return [...this.notifications]
  }
}

export const notificationRuntimeService =
  new NotificationRuntimeService()