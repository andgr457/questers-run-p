import type { PlayerEntity } from '../entities/player/types/PlayerEntity.types'
import type {
  ActivityMeta,
  ActivityType,
  ActivityStatus,
} from './types/Activity.types'

export type GameEvent =
  | {
      type: 'activity:start'
      characterId: string
      activityId: string
      activityType: ActivityType
      duration?: number
      meta?: ActivityMeta | undefined
    }
  | {
      type: 'activity:complete'
      characterId: string
      activityId: string
      activityType: ActivityType
      meta?: ActivityMeta | undefined
    }
  | {
      type: 'activity:cancel'
      characterId: string
      activityId: string
      activityType: ActivityType
      meta?: ActivityMeta | undefined
    }
  | {
      type: 'activity:progress'
      characterId: string
      activityId: string
      activityType: ActivityType
      progress: number
      meta?: ActivityMeta | undefined
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

type Listener = (
  event: GameEvent
) => void

type ActivityState = {
  activityId: string

  activityType: ActivityType

  progress: number

  status: ActivityStatus

  startedAt?: number

  duration?: number

  meta?: ActivityMeta
}

class GameEventBus {

  private listeners =
    new Set<Listener>()

  // key = `${characterId}:${activityType}`
  private activityState =
    new Map<string, ActivityState>()

  emit(event: GameEvent) {

    // =====================================
    // ACTIVITY START
    // =====================================

    if (
      event.type
      === 'activity:start'
    ) {

      const key =
        `${event.characterId}:${event.activityType}`

      this.activityState.set(key, {
        activityId:
          event.activityId,

        activityType:
          event.activityType,

        progress: 0,

        status: 'active',

        startedAt:
          event.meta?.startedAt as number,

        duration:
          event.meta?.duration as number,

        meta:
          event.meta,
      })
    }

    // =====================================
    // ACTIVITY PROGRESS
    // =====================================

    if (
      event.type
      === 'activity:progress'
    ) {

      const key =
        `${event.characterId}:${event.activityType}`

      const existing =
        this.activityState.get(key)

      this.activityState.set(key, {
        activityId:
          event.activityId,

        activityType:
          event.activityType,

        progress:
          event.progress,

        status: 'active',

        startedAt:
          existing?.startedAt,

        duration:
          existing?.duration,

        meta:
          existing?.meta,
      })
    }

    // =====================================
    // ACTIVITY COMPLETE
    // =====================================

    if (
      event.type
      === 'activity:complete'
    ) {

      const key =
        `${event.characterId}:${event.activityType}`

      const existing =
        this.activityState.get(key)

      if (existing) {

        this.activityState.set(key, {
          ...existing,

          progress: 1,

          status: 'completed',
        })
      }
    }

    // =====================================
    // ACTIVITY CANCEL
    // =====================================

    if (
      event.type
      === 'activity:cancel'
    ) {

      const key =
        `${event.characterId}:${event.activityType}`

      const existing =
        this.activityState.get(key)

      if (existing) {

        this.activityState.set(key, {
          ...existing,

          status: 'cancelled',
        })
      }
    }

    // =====================================
    // BROADCAST
    // =====================================

    for (const l of this.listeners) {
      l(event)
    }
  }

  subscribe(listener: Listener) {

    this.listeners.add(listener)

    return () => {
      this.listeners.delete(listener)
    }
  }

  // =====================================
  // QUERY API
  // =====================================

  getActivity(
    characterId: string,
    type: ActivityType
  ) {

    return this.activityState.get(
      `${characterId}:${type}`
    ) ?? null
  }

  getActivities(
    characterId: string
  ) {

    return Array.from(
      this.activityState.entries()
    )
      .filter(([key]) =>
        key.startsWith(
          `${characterId}:`
        )
      )
      .map(([, value]) => value)
  }

  getActiveActivity(
    characterId: string
  ) {

    return this.getActivities(
      characterId
    ).find(
      a => a.status === 'active'
    ) ?? null
  }

  isActive(
    characterId: string,
    type: ActivityType
  ) {

    const activity =
      this.getActivity(
        characterId,
        type
      )

    return activity?.status
      === 'active'
  }
}

export const gameEventBus =
  new GameEventBus()