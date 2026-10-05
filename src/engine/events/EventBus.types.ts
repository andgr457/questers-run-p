import type { PlayerEventMap } from './player/PlayerEvents.types';

export interface EventMaps extends 
  PlayerEventMap
{}

export type EventType = keyof EventMaps
export type EventMeta<T extends EventType> = EventMaps[T]
export type EventOf<T extends EventType> = Extract<GameEvent, {type: T}>

export type GameEvent = {
  [T in EventType]: {
    type: T
    meta: EventMeta<T>
  }
}[EventType]
