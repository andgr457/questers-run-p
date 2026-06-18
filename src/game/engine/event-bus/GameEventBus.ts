import type { GameEvents } from './types/GameEvent.types'

type Listener = (event: GameEvents) => void

class GameEventBus {
  private listeners = new Set<Listener>()

  emit(event: GameEvents) {
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