import type { SiteEvent, SiteEvents } from './types/EventBus.types'

type Listener<T_SiteEvent extends SiteEvent = SiteEvents> = (event: T_SiteEvent) => void

class EventBus {
  private listeners = new Set<Listener>()

  emit<T_SiteEvent extends SiteEvent>(event: T_SiteEvent) {
    for (const listener of this.listeners) {
      listener(event as SiteEvents)
    }
  }

  subscribe<T_SiteEvent extends SiteEvent>(listener: Listener<T_SiteEvent>) {
    this.listeners.add(listener as Listener)

    return () => {
      this.listeners.delete(listener as Listener)
    }
  }
}

export const eventBus = new EventBus()