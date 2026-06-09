type ClockListener = (now: number, delta: number) => void

class GameClockService {
  private now = Date.now()

  // used for delta calculation (FIXED)
  private lastTick = Date.now()

  private intervalId?: number

  private listeners = new Set<ClockListener>()

  // ======================
  // DEBUG CONTROL STATE
  // ======================
  private speed = 1
  private paused = false
  private stepMode = false

  // ======================
  // CONTROL API
  // ======================

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

  // ======================
  // START / STOP
  // ======================

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

  // ======================
  // CORE ENGINE TICK
  // ======================

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

  // ======================
  // SUBSCRIBE
  // ======================

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

  // ======================
  // DEBUG HELPERS (optional but useful)
  // ======================

  isPaused() {
    return this.paused
  }

  isStepMode() {
    return this.stepMode
  }
}

export const gameClockService = new GameClockService()