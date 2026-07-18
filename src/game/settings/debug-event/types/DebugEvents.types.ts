import type { GameEventType } from '../../../../engine/event/types/EventBus.types'

export interface DetailFieldValue {
  field: string
  value: unknown
}

export type DebugEventsMode =  'main'
  | 'debug_event_logs'
  | 'global_event_recording'
  | 'player_events'
  | 'character_events'


export interface DebugEventsListUI {
  title: string
  description: React.ReactNode
  items: DebugEventsListItemUI[]
}

export interface DebugEventsListItemUI {
  title: string
  description: React.ReactNode
  mode: DebugEventsMode
}

export interface GroupEventItem {
  type: GameEventType
  title: string, 
  description: string,
  emit: any
}