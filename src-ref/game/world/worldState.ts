import { gameEventBus } from '../engine/events/GameEventBus'
import type { WorldLocation } from './types/WorldLocation.types'

type Listener<T> = {
  selector: () => T
  listener: (value: T) => void
  lastValue: T
}

class WorldStateStore {
  private subscriptions = new Set<Listener<any>>()
  private characterWorldLocations: Record<string, WorldLocation> = {}

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

  getWorldLocation(characterId: string): WorldLocation {
    return this.characterWorldLocations[characterId]
  }

  // =========================
  // LOCATION (ENGINE DRIVER)
  // =========================
  setWorldLocation(characterId: string, worldLocation: WorldLocation) {
    if(!this.characterWorldLocations?.[characterId]){
      this.characterWorldLocations[characterId] = {
        ...worldLocation
      }
    } else {
      this.characterWorldLocations[characterId] = {
        ...worldLocation
      }
    }

    this.emit()

    gameEventBus.emit({
      type: 'world:location_changed',
      characterId,
      worldLocation,
    })
  }
}

export const worldStateStore = new WorldStateStore()