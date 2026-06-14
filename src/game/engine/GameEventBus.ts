import type { PlayerEntity } from '../entities/player/types/PlayerEntity.types'
import type { ActivityMeta, ActivityType } from './types/Activity.types'

export type GameEvent =
  | {
      type: 'activity:start'
      characterId: string
      activityId: string
      activityType: ActivityType
      duration?: number
      meta?: ActivityMeta
    }
  | {
      type: 'activity:progress'
      characterId: string
      activityId: string
      activityType: ActivityType
      progress: number
      meta?: ActivityMeta
    }
  | {
      type: 'activity:complete'
      characterId: string
      activityId: string
      activityType: ActivityType
      meta?: ActivityMeta
    }
  | {
      type: 'activity:cancel'
      characterId: string
      activityId: string
      activityType: ActivityType
      meta?: ActivityMeta
    }
  | {
      type: 'player:dirty'
      player: PlayerEntity
    }
  | {
      type: 'player:save'
      player: PlayerEntity
    }
  | {
      type: 'character:dirty'
      characterId: string
    }
  | {
      type: 'character:save'
      characterId: string
    }

type Listener = (event: GameEvent) => void

class GameEventBus {
  private listeners = new Set<Listener>()

  emit(event: GameEvent) {
    for (const listener of this.listeners) {
      listener(event)
    }
  }

  subscribe(listener: Listener) {
    this.listeners.add(listener)

    return () => {
      this.listeners.delete(listener)
    }
  }
}

export const gameEventBus = new GameEventBus()