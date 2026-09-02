import type { GameEvent } from '../../types/EventBus.types'
import type { EventServiceIds } from './EventService.types'

export type EventLogStatus = 'processing' | 'complete' | 'error'
export interface GameEventLog {
  id: string
  event: GameEvent
  started: number
  completed: number
  status: EventLogStatus
  messages: string[]
}

export type SystemEventType = 'init:start' 
  | 'init:end' 
  | 'service:load:start' 
  | 'service:load:end'
  | 'service:save:start' 
  | 'service:save:end'  

export interface SystemEventLog {
  id: string
  description: string
  eventServiceId: EventServiceIds
  type: SystemEventType
  created: number
  error?: string
}