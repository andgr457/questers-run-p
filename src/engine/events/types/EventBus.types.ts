import type { CharacterEventMap } from './CharacterEvents.types'
import type { WorldModeEventMap } from './WorldModeEvents.types'

export interface EventMaps extends 
  WorldModeEventMap,
  CharacterEventMap
  {}
export type GameEventType = keyof EventMaps

export type EventMeta<T extends GameEventType> = EventMaps[T]
export type GameEventOf<T extends GameEventType> = Extract<GameEvent, { type: T }>
export type GameEvent = {
  [T in GameEventType]: {
    id: string
    parentEventId?: string
    created: number
    type: T
    meta: EventMeta<T>
  }
}[GameEventType]