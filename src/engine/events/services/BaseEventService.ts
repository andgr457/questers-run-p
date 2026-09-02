import { clockRuntimeService } from '../../clock/ClockRuntimeService'
import type { GameEvent } from '../types/EventBus.types'
import { GAME_EVENT_SERVICE_IDS, GAME_EVENT_SERVICES } from './data/EventService.data'
import type { GameEventLog, SystemEventLog } from './types/EventLog.types'
import type { EventServiceIds, GameEventService } from './types/EventService.types'
import { getSystemEventLogServiceInitEnd, getSystemEventLogServiceInitStart, getSystemEventLogServiceSaveStart } from './utils/EventLog.utils'


export abstract class BaseEventService {
  protected initialized = false
  private saveInterval: number | undefined

  serviceMeta: GameEventService = GAME_EVENT_SERVICES[GAME_EVENT_SERVICE_IDS.unkown_event_service]
  eventLogs: GameEventLog[] = []
  systemEventLogs: SystemEventLog[] = []

  init(serviceId: EventServiceIds) {
    if (this.initialized) return

    this.systemEventLogs.push(
      getSystemEventLogServiceInitStart(serviceId)
    )

    this.serviceMeta = GAME_EVENT_SERVICES[serviceId]
    this.initialized = true

    this.onInit()

    this.systemEventLogs.push(
      getSystemEventLogServiceInitEnd(serviceId)
    )
  }

  protected startSaveTimer(saveFn: () => void) {
    if (this.saveInterval) {
      return
    }

    this.saveInterval = window.setInterval(() => {
      if(this.serviceMeta){
        this.systemEventLogs.push(
          getSystemEventLogServiceSaveStart(this.serviceMeta.id)
        )
      }
      saveFn()
      if(this.serviceMeta){
        this.systemEventLogs.push(
          getSystemEventLogServiceSaveStart(this.serviceMeta.id)
        )
      }
    }, 2500)
  }

  protected stopSaveTimer() {
    if (!this.saveInterval) {
      return
    }

    clearInterval(this.saveInterval)

    this.saveInterval = undefined
  }

  protected abstract onInit(): void
}