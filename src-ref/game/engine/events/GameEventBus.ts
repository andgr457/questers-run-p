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

type ActivityState = {
  activityId: string
  activityType: string
  progress: number
  status: 'active' | 'completed' | 'cancelled'
}

class GameEventBus {
  private listeners = new Set<Listener>()

  // 🧠 MEMORY STORE (NEW)
  private activityState = new Map<string, ActivityState>() 
  // key = `${characterId}:${activityType}`

  emit(event: GameEvent) {
    // ---- update memory ----
    if (event.type === 'activity:start') {
      const key = `${event.characterId}:${event.activityType}`

      this.activityState.set(key, {
        activityId: event.activityId,
        activityType: event.activityType,
        progress: 0,
        status: 'active',
      })
    }

    if (event.type === 'activity:progress') {
      const key = `${event.characterId}:${event.activityType}`

      this.activityState.set(key, {
        activityId: event.activityId,
        activityType: event.activityType,
        progress: event.progress,
        status: 'active',
      })
    }

    if (event.type === 'activity:complete') {
      const key = `${event.characterId}:${event.activityType}`

      const existing = this.activityState.get(key)
      if (existing) {
        this.activityState.set(key, {
          ...existing,
          progress: 1,
          status: 'completed',
        })
      }
    }

    if (event.type === 'activity:cancel') {
      const key = `${event.characterId}:${event.activityType}`
      this.activityState.delete(key)
    }

    // ---- broadcast ----
    for (const l of this.listeners) l(event)
  }

  subscribe(listener: Listener) {
    this.listeners.add(listener)

    return () => {
      this.listeners.delete(listener)
    }
  }

  // =========================
  // 🧠 QUERY API (NEW)
  // =========================
  getActivity(characterId: string, type: string) {
    return this.activityState.get(`${characterId}:${type}`) ?? null
  }

  isActive(characterId: string, type: string) {
    return this.activityState.has(`${characterId}:${type}`)
  }
}

export const gameEventBus = new GameEventBus()