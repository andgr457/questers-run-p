import type { FloatingTextEventMap } from './FloatingTextEvents.types'
import type { PlayerEventMap } from './PlayerEvents.types'

export interface EventMaps extends 
  FloatingTextEventMap,
  PlayerEventMap
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