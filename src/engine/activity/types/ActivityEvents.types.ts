import type { GameEvent } from '../../event/types/EventBus.types'

export type ActivityEventTypes =
  | 'activity:start'
  | 'activity:started'
  | 'activity:stop'
  | 'activity:stopped'
  | 'activity:progress'
  | 'activity:completed'

export type ActivityType = 'questing' 
  | 'hunting' 
  | 'crafting' 
  | 'collecting'
  | 'sleeping' 
  | 'eating' 
  | 'resting'

interface GameEvent_ActivityStart extends GameEvent {
  type: 'activity:start'
  meta: {
    characterId: string
    activityText: string
    activityRunTimeMs?: number
    activityRuns?: number
    activityProgressPercent?: number
    activityType?: ActivityType
    xp: number
    gold: number
  }
}

interface GameEvent_ActivityStarted extends GameEvent {
  type: 'activity:started'
  meta: {
    characterId: string
  }
}

interface GameEvent_ActivityStop extends GameEvent {
  type: 'activity:stop'
  meta: {
    characterId: string
  }
}

interface GameEvent_ActivityStopped extends GameEvent {
  type: 'activity:stopped'
  meta: {
    characterId: string
  }
}

interface GameEvent_ActivityProgress extends GameEvent {
  type: 'activity:progress'
  meta: {
    characterId: string
    activityText: string
    progressPercent: number
  }
}

interface GameEvent_ActivityCompleted extends GameEvent {
  type: 'activity:completed'
  meta: {
    characterId: string
  }
}

export type ActivityEvents =
  | GameEvent_ActivityStart
  | GameEvent_ActivityStarted
  | GameEvent_ActivityStop
  | GameEvent_ActivityStopped
  | GameEvent_ActivityProgress
  | GameEvent_ActivityCompleted