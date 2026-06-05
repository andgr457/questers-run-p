import type { EncounterRuntimeEntry } from './encounterTypes'

type Listener = () => void

class EncounterRuntimeStore {
  private encounters = new Map<string, EncounterRuntimeEntry>()

  private listeners = new Set<Listener>()

  // ======================
  // SUBSCRIPTION
  // ======================
  subscribe = (listener: Listener) => {
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
  getAll() {
    return Array.from(this.encounters.values())
  }

  getByCharacter(characterId: string) {
    return Array.from(this.encounters.values()).find(
      e =>
        e.characterId === characterId &&
        e.status === 'active'
    )
  }

  isLocked(characterId: string) {
    return !!this.getByCharacter(characterId)
  }

  canStartEncounter(characterId: string) {
    return !this.isLocked(characterId)
  }

  // ======================
  // WRITE
  // ======================
  start(entry: EncounterRuntimeEntry) {
    this.encounters.set(entry.id, entry)
    this.emit()
  }

  complete(id: string) {
    const existing = this.encounters.get(id)
    if (!existing) return

    existing.status = 'completed'
    this.encounters.set(id, existing)

    this.emit()
  }

  cancel(id: string) {
    const existing = this.encounters.get(id)
    if (!existing) return

    existing.status = 'cancelled'
    this.encounters.set(id, existing)

    this.emit()
  }

  remove(id: string) {
    this.encounters.delete(id)
    this.emit()
  }
}

export const encounterRuntimeStore =
  new EncounterRuntimeStore()