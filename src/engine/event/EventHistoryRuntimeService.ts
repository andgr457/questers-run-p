import { DateTime } from 'luxon'
import { clockRuntimeService } from '../clock/ClockRuntimeService'
import { GAME_STORAGE_KEYS } from '../data/local-storage/GameStorageKeys.data'
import { eventBus } from '../event/EventBus'
import type { EventHistoryItem } from './types/EventHistory.types'

class EventHistoryRuntimeService {
  private initialized = false
  private history: EventHistoryItem[] = []

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
        this.history = []
        return
      }

      this.history = JSON.parse(history)
      this.purgeHistory()
      this.saveHistory()
      this.emitHistoryUpdated()
    } catch {
      this.history = []
    }
  }

  private purgeHistory() {
    const hourAgoMs = DateTime.now().minus({hours: 1}).toMillis()
    const purgableHistoryIds = this.history.filter(h => 
      h.date < hourAgoMs && h.viewed === true
    ).map(h => h.id)
    this.history = this.history.filter(
      item => !purgableHistoryIds.includes(item.id)
    )
  }

  private saveHistory() {
    localStorage.setItem(
      GAME_STORAGE_KEYS.EVENT_HISTORY_GAME,
      JSON.stringify(this.history)
    )
  }

  private emitHistoryUpdated() {
    eventBus.emit({
      id: crypto.randomUUID(),
      type: 'event:history:updated',
    })
  }

  addHistory(
    title: string,
    description?: string,
  ) {
    this.history = [
      {
        id: crypto.randomUUID(),
        date: clockRuntimeService.getNow(),
        title,
        description,
        viewed: false,
      },
      ...this.history,
    ]
    this.purgeHistory()
    this.saveHistory()
    this.emitHistoryUpdated()
  }

  markViewed(id: string) {
    this.history = this.history.map(item =>
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
    this.history = this.history.filter(
      item => item.id !== id
    )

    this.saveHistory()
    this.emitHistoryUpdated()
  }

  clearHistory() {
    this.history = []

    this.saveHistory()
    this.emitHistoryUpdated()
  }

  getHistory() {
    return [...this.history]
  }

  getUnreadCount() {
    return this.history.filter(
      item => !item.viewed
    ).length
  }
}

export const eventHistoryRuntimeService =
  new EventHistoryRuntimeService()