import { gameClockService } from '../clock/GameClockService'
import { gameEventBus } from '../event-bus/GameEventBus'
import type { ActivityEntry, ActivityType } from './types/Activity.types'

type CharacterActivityCache = {
  all: ActivityEntry[]
  active: ActivityEntry[]
  byType: Map<ActivityType, ActivityEntry>
  locked: boolean
}

type Listener = () => void

class ActivityRuntimeService {
  private activities = new Map<string, Map<string, ActivityEntry>>()
  private cache = new Map<string, CharacterActivityCache>()
  private listeners = new Set<Listener>()

  init() {
    gameClockService.subscribe(now => {
      this.onTick(now)
    })
  }

  subscribe(listener: Listener) {
    this.listeners.add(listener)

    return () => {
      this.listeners.delete(listener)
    }
  }

  private notify() {
    for (const listener of this.listeners) {
      listener()
    }
  }

  private onTick(now: number) {
    const ARRIVAL_BUFFER_MS = 1000
    const COMPLETION_FUDGE_MS = 1500

    let notify = false

    for (const [characterId, bucket] of this.activities.entries()) {
      let dirty = false

      for (const activity of bucket.values()) {
        if (
          activity.status !== 'active' &&
          activity.status !== 'completed'
        ) {
          continue
        }

        const elapsed = now - activity.startedAt
        const progress = Math.min(elapsed / activity.duration, 1)

        gameEventBus.emit({
          type: 'activity:progress',
          characterId,
          activityId: activity.id,
          activityType: activity.type,
          progress,
          continuous: activity.continuous
        })

        notify = true

        if (
          activity.status === 'active' &&
          elapsed >= activity.duration + COMPLETION_FUDGE_MS
        ) {
          activity.status = 'completed'
          activity.completedAt = now
          dirty = true

          gameEventBus.emit({
            type: 'activity:complete',
            characterId,
            activityId: activity.id,
            activityType: activity.type,
            meta: activity.meta,
            continuous: activity.continuous,
          })
        }

        if (
          activity.status === 'completed' &&
          activity.completedAt &&
          now - activity.completedAt >= ARRIVAL_BUFFER_MS
        ) {
          bucket.delete(activity.id)
          dirty = true
        }
      }

      if (dirty) {
        this.recompute(characterId)
      }
    }

    if (notify) {
      this.notify()
    }
  }

  private getBucket(characterId: string) {
    if (!this.activities.has(characterId)) {
      this.activities.set(characterId, new Map())
    }

    return this.activities.get(characterId)!
  }

  private recompute(characterId: string) {
    const bucket = this.getBucket(characterId)

    const all = Array.from(bucket.values())
    const active = all.filter(a => a.status === 'active')

    const byType = new Map<ActivityType, ActivityEntry>()

    for (const activity of active) {
      if (!byType.has(activity.type)) {
        byType.set(activity.type, activity)
      }
    }

    const locked = active.some(a => a.blocking)

    this.cache.set(characterId, {
      all,
      active,
      byType,
      locked,
    })
  }

  getProgress(characterId: string, activityId: string) {
    const bucket = this.activities.get(characterId)
    const activity = bucket?.get(activityId)

    if (!activity) return 0

    const elapsed = gameClockService.getNow() - activity.startedAt

    return Math.min(elapsed / activity.duration, 1)
  }

  getActivity(characterId: string, activityId: string) {
    return this.activities
      .get(characterId)
      ?.get(activityId)
  }

  getAll(characterId: string) {
    return this.cache.get(characterId)?.all ?? []
  }

  getAllActivities() {
    return Array.from(this.activities.values())
      .flatMap(bucket => Array.from(bucket.values()))
  }

  getActive(characterId: string) {
    return this.cache.get(characterId)?.active ?? []
  }

  getActivitiesForCharacter(characterId: string) {
    return this.cache.get(characterId)?.all ?? []
  }

  getActiveQuests(characterId: string) {
    return this.getActive(characterId)
      .filter(a => a.type === 'questing')
  }

  getByType(characterId: string, type: ActivityType) {
    return this.cache
      .get(characterId)
      ?.byType
      .get(type)
  }

  isLocked(characterId: string) {
    return this.cache.get(characterId)?.locked ?? false
  }

  canStart(characterId: string) {
    return !this.isLocked(characterId)
  }

  start(entry: ActivityEntry) {
    const bucket = this.getBucket(entry.characterId)

    bucket.set(entry.id, {
      ...structuredClone(entry),
      status: 'active',
      startedAt: entry.startedAt ?? gameClockService.getNow(),
    })

    this.recompute(entry.characterId)

    gameEventBus.emit({
      type: 'activity:start',
      characterId: entry.characterId,
      activityId: entry.id,
      activityType: entry.type,
      duration: entry.duration,
      continuous: entry.continuous
    })

    this.notify()
  }

  complete(characterId: string, activityId: string) {
    const bucket = this.getBucket(characterId)
    const activity = bucket.get(activityId)

    if (!activity) return
    if (activity.status === 'completed') return

    activity.status = 'completed'
    activity.completedAt = gameClockService.getNow()

    this.recompute(characterId)

    gameEventBus.emit({
      type: 'activity:complete',
      characterId,
      activityId,
      activityType: activity.type,
      meta: activity.meta,
      continuous: activity?.continuous ?? false,
    })

    this.notify()
  }

  cancel(characterId: string, activityId: string) {
    const bucket = this.getBucket(characterId)
    const activity = bucket.get(activityId)

    if (!activity) return

    activity.status = 'cancelled'

    this.recompute(characterId)

    gameEventBus.emit({
      type: 'activity:cancel',
      characterId,
      activityId,
      activityType: activity.type,
      meta: activity.meta,
      continuous: activity.continuous,
    })

    this.notify()
  }

  remove(characterId: string, activityId: string) {
    const bucket = this.getBucket(characterId)

    bucket.delete(activityId)

    this.recompute(characterId)
    this.notify()
  }
}

export const activityRuntimeService = new ActivityRuntimeService()