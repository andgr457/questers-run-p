
export type EventServiceIds = 'unkown_event_service'
  | 'world_mode_event_service'
  | 'character_event_service'

export interface GameEventService {
  id: EventServiceIds
  title: string
  description: string
}

