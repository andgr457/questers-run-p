export abstract class BaseEventService {
  protected initialized = false
  private saveInterval: number | undefined

  init() {
    if (this.initialized) return

    this.initialized = true
    this.onInit()
  }

  protected startSaveTimer(saveFn: () => void) {
    if (this.saveInterval) {
      return
    }

    this.saveInterval = window.setInterval(() => {
      saveFn()
    }, 5000)
  }

  protected stopSaveTimer() {
    if (!this.saveInterval) {
      return
    }

    clearInterval(this.saveInterval)

    this.saveInterval = undefined
  }

  protected abstract onInit(): void
}