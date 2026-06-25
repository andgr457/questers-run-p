import type { GameNotification } from './types/Notification.types'

type Listener = (items: GameNotification[]) => void;

class NotificationRuntimeService {
  private queue: GameNotification[] = [];
  private visible: GameNotification[] = [];
  private listeners = new Set<Listener>();

  private maxVisible = 1;
  private timeouts = new Map<string, number>();
  
  subscribe(listener: Listener) {
    this.listeners.add(listener);
    listener(this.visible);

    return () => {
      this.listeners.delete(listener);
    };
  }

  private emit() {
    for (const l of this.listeners) {
      l(this.visible);
    }
  }

  notify(input: Omit<GameNotification, "id">) {
    const id = (Date.now() + Math.random()).toString();

    const item: GameNotification = {
      id,
      text: input.text,
      type: input.type,
      lifetime: input.lifetime
    };

    this.queue.push(item);
    this.drain();
  }

  private drain = () => {
    while (
      this.visible.length < this.maxVisible &&
      this.queue.length > 0
    ) {
      const next = this.queue.shift()!;
      this.visible = [...this.visible, next];

      this.startTimer(next);
    }

    this.emit();
  };

  private startTimer(item: GameNotification) {
    const timeout = window.setTimeout(() => {
      this.remove(item.id);
    }, item.lifetime);

    this.timeouts.set(item.id, timeout);
  }

  remove(id: string) {
    const timeout = this.timeouts.get(id);
    if (timeout) clearTimeout(timeout);

    this.timeouts.delete(id);

    this.visible = this.visible.filter(n => n.id !== id);

    this.emit();
    this.drain();
  }
}

export const notificationRuntimeService = new NotificationRuntimeService();