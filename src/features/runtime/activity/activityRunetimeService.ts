import type { ActivityEntry, ActivityType } from './activityTypes'

type Listener = () => void

class ActivityRuntimeService {
  private activities = new Map<string, ActivityEntry>()
  private listeners = new Set<Listener>()

  // ======================
  // SUBSCRIBE
  // ======================
  subscribe(listener: Listener) {
    this.listeners.add(listener)

    return () => {
      this.listeners.delete(listener)
    }
  }

  private emit() {
    for (const l of this.listeners) {
      l()
    }
  }

  // ======================
  // READ
  // ======================

  getAll(characterId: string) {
    return Array.from(this.activities.values()).filter(
      a => a.characterId === characterId
    )
  }

  getActive(characterId: string) {
    return Array.from(this.activities.values()).filter(
      a =>
        a.characterId === characterId &&
        a.status === 'active'
    )
  }

  getActiveQuests(characterId: string) {
    return this.getActive(characterId).filter(
      a => a.type === 'quest'
    )
  }

  isLocked(characterId: string) {
    return this.getActive(characterId).some(
      a => a.blocking === true
    )
  }

  getByType(characterId: string, type: ActivityType) {
    return this.getActive(characterId).find(
      a => a.type === type
    )
  }

  canStart(characterId: string) {
    return !this.isLocked(characterId)
  }

  // ======================
  // WRITE
  // ======================

  start(entry: ActivityEntry) {
    this.activities.set(entry.id, entry)
    this.emit()
  }

  complete(id: string) {
    const existing = this.activities.get(id)
    if (!existing) return

    existing.status = 'completed'
    this.activities.set(id, existing)

    this.emit()
  }

  cancel(id: string) {
    const existing = this.activities.get(id)
    if (!existing) return

    existing.status = 'cancelled'
    this.activities.set(id, existing)

    this.emit()
  }

  remove(id: string) {
    this.activities.delete(id)
    this.emit()
  }
}

export const activityRuntimeService =
  new ActivityRuntimeService()