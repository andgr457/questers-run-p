import type { GameEvents } from './types/EventBus.types'

type Listener = (event: GameEvents) => void

class EventBus {
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

export const eventBus = new EventBus()