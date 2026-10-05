
export abstract class BaseEventService {
  protected initialized = false

  async init() {
    if (this.initialized) return

    this.initialized = true

    await this.startSaveTimer()
    await this.onInit()
  }

  protected abstract onInit(): Promise<void>
  protected abstract startSaveTimer(): Promise<void>
}
