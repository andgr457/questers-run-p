export interface GameNotification {
  id: string
  text: React.ReactNode
  lifetime?: number
}

type Listener = (notification: GameNotification) => void

class NotificationRuntimeService {
  private listeners = new Set<Listener>()

  subscribe(listener: Listener) {
    this.listeners.add(listener)

    return () => {
      this.listeners.delete(listener)
    }
  }

  notify(
    text: React.ReactNode,
    lifetime = 2500
  ) {
    const notification: GameNotification = {
      id: crypto.randomUUID(),
      text,
      lifetime,
    }

    this.listeners.forEach(listener => listener(notification))
  }
}

export const notificationRuntimeService =
  new NotificationRuntimeService()