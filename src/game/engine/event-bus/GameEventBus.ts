import type { PlayerEntity } from '../../entities/player/types/PlayerEntity.types'
import type { ActivityMeta, ActivityType } from '../activity/types/Activity.types'

export type GameEvent =
  | {
      type: 'activity:start'
      characterId: string
      activityId: string
      activityType: ActivityType
      duration?: number
      meta?: ActivityMeta
      continuous: boolean
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
      continuous: boolean
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
      characterId?: string
    }
  | {
      type: 'player:save'
      player: PlayerEntity
      characterId?: string
    }
  | {
      type: 'character:dirty'
      characterId: string
    }
  | {
      type: 'character:save'
      characterId: string
    }
  | {
      type: 'quest:start'
      characterId: string
      questId: string
      continuous: boolean
    }
  | {
      type: 'quest:cancel'
      characterId: string
      questId: string
    }
  | {
      type: 'quest:complete'
      characterId: string
      questId: string
      continuous: boolean
    }
  | {
      type: 'character:xp:add'
      characterId: string
      amount: number
      source?: string
    }
  | {
      type: 'character:stamina:add'
      characterId: string
      amount: number
      source?: string
    }
  | {
      type: 'character:stamina:remove'
      characterId: string
      amount: number
      source?: string
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