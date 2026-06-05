import { gameEventBus } from '../engine/events/GameEventBus'

export type WorldLocation =
  | 'plains'
  | 'town'
  | 'guild'
  | 'woods'
  | 'cave'
  | 'dungeon'

type WorldState = {
  characterId: string
  location: WorldLocation
  flags: {
    introSeen?: boolean
  }
}

type Listener<T> = {
  selector: () => T
  listener: (value: T) => void
  lastValue: T
}

class WorldStateStore {
  private state: Record<string, WorldState> = {}

  private subscriptions = new Set<Listener<any>>()

  // =========================
  // SUBSCRIBE (REACTIVE)
  // =========================
  subscribe<T>(selector: () => T, listener: (value: T) => void) {
    const sub: Listener<T> = {
      selector,
      listener,
      lastValue: selector(),
    }

    this.subscriptions.add(sub)

    listener(sub.lastValue)

    return () => {
      this.subscriptions.delete(sub)
    }
  }

  private emit() {
    for (const sub of this.subscriptions) {
      const next = sub.selector()

      if (!Object.is(sub.lastValue, next)) {
        sub.lastValue = next
        sub.listener(next)
      }
    }
  }

  // =========================
  // INIT
  // =========================
  initCharacter(characterId: string) {
    this.state[characterId] = {
      characterId,
      location: 'plains',
      flags: {
        introSeen: false,
      },
    }

    this.emit()

    gameEventBus.emit({
      type: 'world:location_changed',
      characterId,
      location: 'plains',
    })
  }

  // =========================
  // FLAGS
  // =========================
  setFlag(
    characterId: string,
    key: keyof WorldState['flags'],
    value: boolean
  ) {
    const state = this.state[characterId]
    if (!state) return

    state.flags[key] = value
    this.emit()
  }

  // =========================
  // READ
  // =========================
  get(characterId: string) {
    return this.state[characterId]
  }

  // =========================
  // LOCATION (ENGINE DRIVER)
  // =========================
  setLocation(characterId: string, location: WorldLocation) {
    if (!this.state[characterId]) {
      this.initCharacter(characterId)
    }

    this.state[characterId].location = location

    this.emit()

    gameEventBus.emit({
      type: 'world:location_changed',
      characterId,
      location,
    })
  }
}

export const worldStateStore = new WorldStateStore()