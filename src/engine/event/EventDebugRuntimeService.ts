import { clockRuntimeService } from '../clock/ClockRuntimeService'
import { eventBus } from '../event/EventBus'
import type { EventBusLog, GameEvent } from '../event/types/EventBus.types'
import { GAME_EVENT_BUS_DEBUG_RECORDING_TYPES } from './utils/EventBus.utils'

class EventDebugRuntimeService {
  private initialized = false
  private history: EventBusLog[] = []
  private isRecording = false
  private lastStartDate: number | undefined
  private lastEndDate: number | undefined
  private isDebugMode = false

  init() {
    if (this.initialized) {
      return
    }

    this.initialized = true

    eventBus.subscribe(event => {
      
      if(this.isRecording === true && !GAME_EVENT_BUS_DEBUG_RECORDING_TYPES.includes(event.type)){
        this.addHistory(event as GameEvent)
      }

      if (event.type === 'event:debug:recording:start') {
        this.startRecording(event)
      }
      if(event.type === 'event:debug:recording:stop'){
        this.stopRecording(event)
      }
      if(event.type === 'event:debug:mode'){
        this.isDebugMode = event.meta.isDebugMode
      }
    })
  }

  private addHistory(event: GameEvent){
    this.history = [
      {
        date: clockRuntimeService.getNow(),
        event
      },
      ...this.history,
    ]
    eventBus.emit({
      id: crypto.randomUUID(),
      type: 'event:debug:recording:history',
    })
  }

  clearHistory() {
    this.history = []
    eventBus.emit({
      id: crypto.randomUUID(),
      type: 'event:debug:recording:history',
    })
  }

  private startRecording(event: GameEvent) {
    if(this.isRecording === true) return
    
    this.lastStartDate = clockRuntimeService.getNow()
    this.lastEndDate = undefined
    this.isRecording = true
    eventBus.emit({
      ...event,
      type: 'event:debug:recording:started'
    })
  }
  
  private stopRecording(event: GameEvent) {
    this.lastEndDate = clockRuntimeService.getNow()
    this.isRecording = false
    eventBus.emit({
      ...event,
      type: 'event:debug:recording:stopped'
    })
  }

  getRecordingDetail() {
    return {
      isRecording: this.isRecording,
      history: this.history,
      lastStartDate: this.lastStartDate,
      lastEndDate: this.lastEndDate,
      isDebugMode: this.isDebugMode
    }
  }
}
export const eventDebugRuntimeService =
  new EventDebugRuntimeService()