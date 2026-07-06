import { GAME_TUTORIALS } from '../../game/tutorial/data/Tutorial.data'
import type { TutorialProgress } from '../../game/tutorial/types/Tutorial.types'
import { GAME_STORAGE_KEYS } from '../data/local-storage/GameStorageKeys.data'
import { eventBus } from '../event/EventBus'

class TutorialRuntimeService {
  private initialized = false

  private progress: TutorialProgress = {
    completedTutorialIds: [],
  }

  init() {
    if (this.initialized) {
      return
    }

    this.initialized = true
    this.loadProgress()
  }

  private loadProgress() {
    try {
      const progress = localStorage.getItem(
        GAME_STORAGE_KEYS.TUTORIAL_PROGRESS_GAME
      )

      if (!progress) {
        return
      }

      this.progress = JSON.parse(progress)
    } catch {
      this.progress = {
        completedTutorialIds: [],
      }
    }
  }

  private saveProgress() {
    localStorage.setItem(
      GAME_STORAGE_KEYS.TUTORIAL_PROGRESS_GAME,
      JSON.stringify(this.progress)
    )
  }

  private emitUpdated() {
    eventBus.emit({
      id: crypto.randomUUID(),
      type: 'tutorial:updated',
    })
  }

  completeTutorial(tutorialId: string) {
    if (this.progress.completedTutorialIds.includes(tutorialId)) {
      return
    }

    this.progress.completedTutorialIds.push(tutorialId)

    const tutorial = GAME_TUTORIALS.find(t => t.id === tutorialId)

    if (tutorial?.rewards?.length) {
      eventBus.emit({
        id: crypto.randomUUID(),
        type: 'rewards:grant',
        meta: {
          rewards: {
            rewardsBase: tutorial.rewards,
            source: {
              type: 'tutorial',
              tutorialId,
            },
          }
        },
      })
    }

    this.saveProgress()
    this.emitUpdated()
  }

  resetAllTutorials() {
    this.progress = {
      completedTutorialIds: [],
    }

    this.saveProgress()
    this.emitUpdated()
  }

  isComplete(tutorialId: string) {
    return this.progress.completedTutorialIds.includes(tutorialId)
  }

  getProgress() {
    return {
      ...this.progress,
    }
  }

  getCurrentTutorial() {
    return GAME_TUTORIALS.find(
      tutorial => !this.isComplete(tutorial.id)
    )
  }
}

export const tutorialRuntimeService =
  new TutorialRuntimeService()