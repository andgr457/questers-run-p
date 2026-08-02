import { GAME_TUTORIAL_IDS } from '../../game/tutorial/data/Tutorial.data'
import { clockRuntimeService } from '../clock/ClockRuntimeService'
import { eventBus } from '../event/EventBus'
import type { GameEvent } from '../event/types/EventBus.types'
import { tutorialRuntimeService } from '../tutorial/TutorialRuntimeService'
import type { ActivityType } from './types/ActivityEvents.types'

export interface ActivityRuntimeEntity {
  characterId: string
  activityText: string

  xp: number
  gold: number
  activityRunTimeMs: number
  activityRuns: number
  activityStartedAt: number
  activityProgressPercent: number
  activityType: ActivityType
}

class ActivityRuntimeService {
  private initialized = false
  private interval: number | undefined
  private activities: Record<string, ActivityRuntimeEntity> = {}

  init() {
    if (this.initialized) {
      return
    }

    this.initialized = true

    eventBus.subscribe(event => {
      if (event.type === 'activity:start') {
        this.startActivity(event)
      }

      if (event.type === 'activity:stop') {
        this.stopActivity(event)
      }
    })
  }

  start() {
    if (this.interval) {
      return
    }

    this.interval = window.setInterval(() => {
      this.tick()
    }, 250)
  }

  stop() {
    if (!this.interval) {
      return
    }

    clearInterval(this.interval)
    this.interval = undefined
  }

  getActivities() {
    return Object.values(this.activities)
  }

  getActivity(characterId: string) {
    return this.activities[characterId]
  }

  isRunning(characterId: string) {
    return this.activities[characterId] !== undefined
  }

  private startActivity(event: GameEvent) {
    const characterId = event.meta?.characterId as string

    if (!characterId) {
      return
    }

    //tutorial checks
    //check tutorial completion
    const currentTutorial = tutorialRuntimeService.getCurrentTutorial()
    if(currentTutorial?.id === GAME_TUTORIAL_IDS.TUTORIAL_002_CHARACTER_FIRST_QUEST){
      const allProgress = tutorialRuntimeService.getProgress()
      const currentTutorialProgress = allProgress.playerTutorialProgress.find(p => 
        p.tutorialId === currentTutorial.id
      )
      if(!currentTutorialProgress?.completed === true){
        eventBus.emit({
          id: crypto.randomUUID(),
          type: 'tutorial:complete',
          meta: {
            tutorialId: currentTutorial.id,
          }
        })
      }
    }

    if (this.activities[characterId]) {
      delete this.activities[characterId]

      eventBus.emit({
        id: crypto.randomUUID(),
        parentEventId: event.id,
        type: 'activity:stopped',
        meta: {
          characterId
        }
      })

      return
    }

    this.activities[characterId] = {
      characterId,
      activityText: event.meta?.activityText ?? 'Questing',
      xp: event.meta?.xp ?? 0,
      gold: event.meta?.gold ?? 0,
      activityRunTimeMs: event.meta?.activityRunTimeMs ?? 10000,
      activityRuns: event.meta?.activityRuns ?? -1,
      activityStartedAt: Date.now(),
      activityProgressPercent: 0,
      activityType: event.meta?.activityType as ActivityType
    }

    eventBus.emit({
      id: crypto.randomUUID(),
      parentEventId: event.id,
      type: 'activity:started',
      meta: {
        characterId
      }
    })
  }

  private stopActivity(event: GameEvent) {
    const characterId = event.meta?.characterId as string

    if (!characterId) {
      return
    }

    if (!this.activities[characterId]) {
      return
    }

    delete this.activities[characterId]

    eventBus.emit({
      id: crypto.randomUUID(),
      parentEventId: event.id,
      type: 'activity:stopped',
      meta: {
        characterId
      }
    })
  }

  private tick() {
    const now = Date.now()

    for (const activity of Object.values(this.activities)) {
      const elapsed = now - activity.activityStartedAt

      activity.activityProgressPercent = Math.min(
        100,
        elapsed / activity.activityRunTimeMs * 100
      )

      eventBus.emit({
        id: crypto.randomUUID(),
        type: 'activity:progress',
        meta: {
          characterId: activity.characterId,
          activityText: activity.activityText,
          activityProgressPercent: activity.activityProgressPercent
        }
      })

      if (elapsed < activity.activityRunTimeMs) {
        continue
      }

      eventBus.emit({
        id: crypto.randomUUID(),
        type: 'character:xp',
        meta: {
          characterId: activity.characterId,
          xp: activity.xp
        }
      })

      eventBus.emit({
        id: crypto.randomUUID(),
        type: 'character:gold',
        meta: {
          characterGoldTransaction: {
            id: crypto.randomUUID(),
            characterId: activity.characterId,
            amount: activity.gold,
            date: clockRuntimeService.getNow(),
          }
        }
      })

      eventBus.emit({
        id: crypto.randomUUID(),
        type: 'activity:completed',
        meta: {
          characterId: activity.characterId
        }
      })

      if (activity.activityRuns > 0) {
        activity.activityRuns--

        if (activity.activityRuns === 0) {
          delete this.activities[activity.characterId]

          eventBus.emit({
            id: crypto.randomUUID(),
            type: 'activity:stopped',
            meta: {
              characterId: activity.characterId
            }
          })

          continue
        }
      }

      activity.activityStartedAt = now
      activity.activityProgressPercent = 0
    }
  }
}

export const activityRuntimeService = new ActivityRuntimeService()