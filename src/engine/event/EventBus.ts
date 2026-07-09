import type { GameEvent } from './types/EventBus.types'

type Listener = (event: GameEvent) => void

class EventBus {
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

export const eventBus = new EventBus()