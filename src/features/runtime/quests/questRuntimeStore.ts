import type { QuestProgress } from '../../../interfaces/quests/Quests.types'

type Listener = () => void

class QuestRuntimeStore {
  private quests = new Map<string, QuestProgress>()
  private listeners = new Set<Listener>()

  // ======================
  // SUBSCRIPTION
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

  /**
   * All quest progress for a character
   */
  getAll(characterId: string): QuestProgress[] {
    return Array.from(this.quests.values()).filter(
      q => q.characterId === characterId
    )
  }

  /**
   * Active quest for a character + quest
   */
  getActive(
    characterId: string,
    questId: string
  ): QuestProgress | undefined {
    return Array.from(this.quests.values()).find(
      q =>
        q.characterId === characterId &&
        q.questId === questId &&
        q.status === 'in-progress'
    )
  }

  /**
   * Check if character has ANY active quest
   * (global lock rule)
   */
  isQuestLocked(characterId: string): boolean {
    return Array.from(this.quests.values()).some(
      q =>
        q.characterId === characterId &&
        q.status === 'in-progress'
    )
  }

  // ======================
  // WRITE
  // ======================

  /**
   * Create or update quest progress
   */
  upsert(progress: QuestProgress) {
    this.quests.set(progress.id, progress)
    this.emit()
  }

  /**
   * Mark quest complete
   */
  complete(progressId: string) {
    const existing = this.quests.get(progressId)
    if (!existing) return

    existing.status = 'complete'
    this.quests.set(progressId, existing)

    this.emit()
  }

  /**
   * Remove quest (abandon)
   */
  remove(progressId: string) {
    this.quests.delete(progressId)
    this.emit()
  }

  /**
   * Hard reset (debug / dev tools)
   */
  clear() {
    this.quests.clear()
    this.emit()
  }
}

export const questRuntimeStore = new QuestRuntimeStore()