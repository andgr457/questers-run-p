type ClockListener = (now: number, delta: number) => void

class ClockRuntimeService {
  private now = Date.now()

  private lastTick = Date.now()

  private intervalId?: number

  private listeners = new Set<ClockListener>()

  private speed = 1
  private paused = false
  private stepMode = false

  setSpeed(speed: number) {
    this.speed = speed
  }

  pause() {
    this.paused = true
  }

  resume() {
    this.paused = false
    this.stepMode = false
    this.lastTick = Date.now()
  }

  enableStepMode() {
    this.stepMode = true
    this.paused = true
  }

  step() {
    if (!this.stepMode) return

    // simulate a single tick manually
    this.tick()
  }

  start(tickRate = 250) {
    if (this.intervalId) return

    this.intervalId = window.setInterval(() => {
      this.tick()
    }, tickRate)
  }

  stop() {
    if (!this.intervalId) return

    clearInterval(this.intervalId)
    this.intervalId = undefined
  }

  private tick() {
    // if paused AND not stepping → do nothing
    if (this.paused && !this.stepMode) return

    const now = Date.now()

    // FIXED: proper delta calculation
    const deltaReal = now - this.lastTick
    const delta = deltaReal * this.speed

    this.now += delta
    this.lastTick = now

    for (const listener of this.listeners) {
      listener(this.now, delta)
    }
  }

  subscribe(listener: ClockListener) {
    this.listeners.add(listener)

    listener(this.now, 0)

    return () => {
      this.listeners.delete(listener)
    }
  }

  getNow() {
    return this.now
  }

  isPaused() {
    return this.paused
  }

  isStepMode() {
    return this.stepMode
  }
}

export const clockRuntimeService = new ClockRuntimeService()