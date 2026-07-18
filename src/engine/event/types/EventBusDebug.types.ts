import type { GameEvent } from './EventBus.types'

export type DebugEventTypes = 'event:debug:recording:start'
  | 'event:debug:recording:started'
  | 'event:debug:recording:stop'
  | 'event:debug:recording:stopped'
  | 'event:debug:recording:history'
  | 'event:debug:mode'

export interface GameEvent_DebugRecordingStart extends GameEvent {
  type: 'event:debug:recording:start'
}

export interface GameEvent_DebugRecordingStarted extends GameEvent {
  type: 'event:debug:recording:started'
}

export interface GameEvent_DebugRecordingStop extends GameEvent {
  type: 'event:debug:recording:stop'
}

export interface GameEvent_DebugRecordingStopped extends GameEvent {
  type: 'event:debug:recording:stopped'
}

export interface GameEvent_DebugRecordingHistory extends GameEvent {
  type: 'event:debug:recording:history'
}

export interface GameEvent_DebugMode extends GameEvent {
  type: 'event:debug:mode'
  meta: {
    isDebugMode: boolean
  }
}

export type DebugEvents =  GameEvent_DebugRecordingStart
  | GameEvent_DebugRecordingStarted
  | GameEvent_DebugRecordingStop
  | GameEvent_DebugRecordingStopped
  | GameEvent_DebugRecordingHistory
  | GameEvent_DebugMode