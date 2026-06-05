export type GameEvent =
  | {
      type: 'activity:start'
      characterId: string
      activityId: string
      activityType: string
    }
  | {
      type: 'activity:complete'
      characterId: string
      activityId: string
      activityType: string
    }
  | {
      type: 'activity:cancel'
      characterId: string
      activityId: string
      activityType: string
    }
  | {
      type: 'activity:progress'
      characterId: string
      activityId: string
      activityType: string
      progress: number
    }
  | {
      type: 'world:location_changed'
      characterId: string
      location: string
    }
type Listener = (event: GameEvent) => void

class GameEventBus {
  private listeners = new Set<Listener>()

  emit(event: GameEvent) {
    for (const l of this.listeners) l(event)
  }

  subscribe(listener: Listener) {
    this.listeners.add(listener)

    return () => this.listeners.delete(listener)
  }
}

export const gameEventBus = new GameEventBus()