import { DateTime } from 'luxon'
import { clockRuntimeService } from '../clock/ClockRuntimeService'
import { GAME_STORAGE_KEYS } from '../data/local-storage/GameStorageKeys.data'
import { eventBus } from '../event/EventBus'
import type { Notification } from '../../game/notification/types/Notification.types'

class NotificationRuntimeService {
  private initialized = false
  private notifications: Notification[] = []

  init() {
    if (this.initialized) {
      return
    }

    this.initialized = true

    this.loadHistory()
  }

  private loadHistory() {
    try {
      const history = localStorage.getItem(GAME_STORAGE_KEYS.EVENT_HISTORY_GAME)

      if (!history) {
        this.notifications = []
        return
      }

      this.notifications = JSON.parse(history)
      this.purgeHistory()
      this.saveHistory()
      this.emitHistoryUpdated()
    } catch {
      this.notifications = []
    }
  }

  private purgeHistory() {
    const hourAgoMs = DateTime.now().minus({hours: 1}).toMillis()
    const purgableHistoryIds = this.notifications.filter(h => 
      h.date < hourAgoMs && h.viewed === true
    ).map(h => h.id)
    this.notifications = this.notifications.filter(
      item => !purgableHistoryIds.includes(item.id)
    )
  }

  private saveHistory() {
    localStorage.setItem(
      GAME_STORAGE_KEYS.EVENT_HISTORY_GAME,
      JSON.stringify(this.notifications)
    )
  }

  private emitHistoryUpdated() {
    eventBus.emit({
      id: crypto.randomUUID(),
      type: 'notification:updated',
    })
  }

  addHistory(
    title: string,
    description?: string,
  ) {
    this.notifications = [
      {
        id: crypto.randomUUID(),
        date: clockRuntimeService.getNow(),
        title,
        description,
        viewed: false,
      },
      ...this.notifications,
    ]
    this.purgeHistory()
    this.saveHistory()
    this.emitHistoryUpdated()
  }

  markViewed(id: string) {
    this.notifications = this.notifications.map(item =>
      item.id === id
        ? {
            ...item,
            viewed: true,
          }
        : item
    )

    this.saveHistory()
    this.emitHistoryUpdated()
  }

  removeHistory(id: string) {
    this.notifications = this.notifications.filter(
      item => item.id !== id
    )

    this.saveHistory()
    this.emitHistoryUpdated()
  }

  clearHistory() {
    this.notifications = []

    this.saveHistory()
    this.emitHistoryUpdated()
  }

  getNotifications() {
    return [...this.notifications]
  }

  getUnreadCount() {
    return this.notifications.filter(
      item => !item.viewed
    ).length
  }
}

export const notificationRuntimeService =
  new NotificationRuntimeService()