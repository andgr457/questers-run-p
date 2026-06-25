import { GAME_STORAGE_KEYS } from '../data/local-storage/GameStorageKeys.data'
import { eventBus } from '../event/EventBus'
import { TUTORIALS } from './data/Tutorial.data'
import type { TutorialProgress } from './types/Tutorial.types'

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
        GAME_STORAGE_KEYS.TUTORIAL_PROGRESS
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
      GAME_STORAGE_KEYS.TUTORIAL_PROGRESS,
      JSON.stringify(this.progress)
    )
  }

  private emitUpdated() {
    eventBus.emit({
      id: crypto.randomUUID(),
      type: 'tutorial:updated',
    })
  }

  completeTutorial(
    tutorialId: string
  ) {
    if (
      this.progress.completedTutorialIds.includes(
        tutorialId
      )
    ) {
      return
    }

    this.progress.completedTutorialIds.push(
      tutorialId
    )

    this.saveProgress()
    this.emitUpdated()
  }

  resetTutorial(
    tutorialId: string
  ) {
    this.progress.completedTutorialIds =
      this.progress.completedTutorialIds.filter(
        id => id !== tutorialId
      )

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

  isComplete(
    tutorialId: string
  ) {
    return this.progress.completedTutorialIds.includes(
      tutorialId
    )
  }

  getProgress() {
    return {
      ...this.progress,
    }
  }

  getCurrentTutorial() {
    return TUTORIALS.find(
      tutorial =>
        !this.isComplete(tutorial.id)
    )
  }
}

export const tutorialRuntimeService =
  new TutorialRuntimeService()