import { gameClockService } from './GameClockService'
import { gameEventBus } from './GameEventBus'
import type { ActivityEntry, ActivityType } from './types/Activity.types'

type CharacterActivityCache = {
  all: ActivityEntry[]
  active: ActivityEntry[]
  byType: Map<ActivityType, ActivityEntry>
  locked: boolean
}

type Subscriber<T> = {
  selector: () => T
  listener: (value: T) => void
  lastValue: T
}

class ActivityRuntimeService {
  private activities = new Map<string, Map<string, ActivityEntry>>()
  private cache = new Map<string, CharacterActivityCache>()
  private subscriptions = new Set<Subscriber<any>>()
  
  // ======================
  // INIT ENGINE LOOP
  // ======================
  init() {
    gameClockService.subscribe((now) => {
      this.onTick(now)
    })
  }

  // ======================
  // TICK SYSTEM
  // ======================
  private onTick(now: number) {
    const dirtyCharacters = new Set<string>()
    let changed = false

    const ARRIVAL_BUFFER_MS = 8500 // 👈 UI “settle / arrive” time

    for (const [characterId, bucket] of this.activities.entries()) {
      for (const activity of bucket.values()) {
        const isRunning =
          activity.status === 'active' || activity.status === 'completed'

        if (!isRunning) continue
        if (!activity.duration) continue

        const elapsed = now - activity.startedAt
        const progress = Math.min(elapsed / activity.duration, 1)

        // ======================
        // PROGRESS EVENT
        // ======================
        gameEventBus.emit({
          type: 'activity:progress',
          characterId,
          activityId: activity.id,
          activityType: activity.type,
          progress,
        })

        // ======================
        // FIRST COMPLETION HIT
        // ======================
        const COMPLETION_FUDGE_MS = 2000 // adjust 200–600 depending on feel

        if (
          activity.status === 'active' &&
          elapsed >= activity.duration + COMPLETION_FUDGE_MS
        ) {
          activity.status = 'completed'
          activity.completedAt = now
          changed = true
          dirtyCharacters.add(characterId)
          gameEventBus.emit({
            type: 'activity:complete',
            characterId,
            activityId: activity.id,
            activityType: activity.type,
            meta: activity.meta,
          })
        }

        // ======================
        // FINALIZATION WINDOW
        // ======================
        if (
          activity.status === 'completed' &&
          activity.completedAt &&
          now - activity.completedAt >= ARRIVAL_BUFFER_MS
        ) {
          bucket.delete(activity.id)

          changed = true
          dirtyCharacters.add(characterId)
        }
      }

      if (changed && dirtyCharacters.has(characterId)) {
        this.recompute(characterId)
      }
    }

    if (!changed) return

    this.emit()
  }

  // ======================
  // PROGRESS API (NEW)
  // ======================
  getProgress(characterId: string, activityId: string, now: number) {
    const bucket = this.getBucket(characterId)
    const activity = bucket.get(activityId)

    if (!activity) return 0
    if (!activity.duration) return 0

    const elapsed = now - activity.startedAt
    return Math.min(elapsed / activity.duration, 1)
  }

  // ======================
  // SUBSCRIBE
  // ======================
  subscribe<T>(selector: () => T, listener: (value: T) => void) {
    const sub: Subscriber<T> = {
      selector,
      listener,
      lastValue: selector(),
    }

    this.subscriptions.add(sub)

    listener(sub.lastValue)

    return () => {
      this.subscriptions.delete(sub)
    }
  }

  private emit() {
    for (const sub of this.subscriptions) {
      const next = sub.selector()

      if (!Object.is(sub.lastValue, next)) {
        sub.lastValue = next
        sub.listener(next)
      }
    }
  }

  // ======================
  // INTERNAL HELPERS
  // ======================
  private getBucket(characterId: string) {
    if (!this.activities.has(characterId)) {
      this.activities.set(characterId, new Map())
    }
    return this.activities.get(characterId)!
  }

  // ======================
  // CACHE ENGINE
  // ======================
  private recompute(characterId: string) {
    const bucket = this.getBucket(characterId)
    const all = Array.from(bucket.values())

    const active = all.filter(a => a.status === 'active')

    const byType = new Map<ActivityType, ActivityEntry>()
    for (const a of active) {
      if (!byType.has(a.type)) {
        byType.set(a.type, a)
      }
    }

    const locked = active.some(a => a.blocking === true)

    this.cache.set(characterId, {
      all,
      active,
      byType,
      locked,
    })
  }

  // ======================
  // READ (FAST CACHE)
  // ======================
  getAll(characterId: string) {
    return this.cache.get(characterId)?.all ?? []
  }

  getActive(characterId: string) {
    return this.cache.get(characterId)?.active ?? []
  }

  getActiveQuests(characterId: string) {
    return this.getActive(characterId).filter(a => a.type === 'quest')
  }

  isLocked(characterId: string) {
    return this.cache.get(characterId)?.locked ?? false
  }

  getByType(characterId: string, type: ActivityType) {
    return this.cache.get(characterId)?.byType.get(type)
  }

  canStart(characterId: string) {
    return !this.isLocked(characterId)
  }

  // ======================
  // WRITE
  // ======================
  start(entry: ActivityEntry) {
    const bucket = this.getBucket(entry.characterId)

    const normalized: ActivityEntry = {
      ...structuredClone(entry),
      status: 'active',
      startedAt: entry.startedAt ?? Date.now(),
    }

    bucket.set(entry.id, normalized)

    this.recompute(entry.characterId)
    this.emit()

    gameEventBus.emit({
      type: 'activity:start',
      characterId: entry.characterId,
      activityId: entry.id,
      activityType: entry.type,
    })
  }

  complete(characterId: string, id: string) {
    const bucket = this.getBucket(characterId)
    const existing = bucket.get(id)
    if (!existing) return
    if (existing.status === 'completed') return

    bucket.set(id, {
      ...existing,
      status: 'completed',
    })

    this.recompute(characterId)
    this.emit()

    gameEventBus.emit({
      type: 'activity:complete',
      characterId,
      activityId: id,
      activityType: existing.type
    })
  }

  cancel(characterId: string, id: string) {
    const bucket = this.getBucket(characterId)
    const existing = bucket.get(id)
    if (!existing) return

    bucket.set(id, {
      ...existing,
      status: 'cancelled',
    })

    this.recompute(characterId)
    this.emit()

    gameEventBus.emit({
      type: 'activity:cancel',
      characterId,
      activityId: id,
      activityType: existing.type,
    })
  }

  remove(characterId: string, id: string) {
    const bucket = this.getBucket(characterId)

    bucket.delete(id)

    this.recompute(characterId)
    this.emit()
  }
}

export const activityRuntimeService = new ActivityRuntimeService()