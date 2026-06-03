type ClockListener = (now: number) => void

class GameClockService {
  private now = Date.now()

  private intervalId?: number

  private listeners = new Set<ClockListener>()

  start(tickRate = 250) {
    if (this.intervalId) return

    this.intervalId = window.setInterval(() => {
      this.now = Date.now()

      for (const listener of this.listeners) {
        listener(this.now)
      }
    }, tickRate)
  }

  stop() {
    if (!this.intervalId) return

    clearInterval(this.intervalId)

    this.intervalId = undefined
  }

  subscribe(listener: ClockListener) {
    this.listeners.add(listener)

    listener(this.now)

    return () => {
      this.listeners.delete(listener)
    }
  }

  getNow() {
    return this.now
  }
}

export const gameClockService = new GameClockService()