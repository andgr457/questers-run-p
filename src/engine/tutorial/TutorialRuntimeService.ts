import { GAME_TUTORIALS } from '../../game/tutorial/data/Tutorial.data'
import type { TutorialProgress } from '../../game/tutorial/types/Tutorial.types'
import { GAME_STORAGE_KEYS } from '../data/local-storage/GameStorageKeys.data'
import { eventBus } from '../event/EventBus'
import type { GameEvent } from '../event/types/EventBus.types'

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
    let progressValue = localStorage.getItem(
      GAME_STORAGE_KEYS.TUTORIAL_PROGRESS_GAME
    )

    this.progress = !progressValue ? this.progress : JSON.parse(progressValue)

    eventBus.subscribe(event => {
      if (event.type === 'tutorial:complete') {
        this.completeTutorial(event)
      }
    })
  }

  private saveProgress() {
    localStorage.setItem(
      GAME_STORAGE_KEYS.TUTORIAL_PROGRESS_GAME,
      JSON.stringify(this.progress)
    )
  }

  private emit(event?: GameEvent) {
    eventBus.emit({
      id: crypto.randomUUID(),
      type: 'tutorial:completed',
      parentEventId: event?.id
    })
  }

  completeTutorial(event: GameEvent) {
    const tutorialId = event.meta?.tutorialId
    if(!tutorialId){
      return
    }
    
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
    this.emit()
  }

  resetAllTutorials() {
    this.progress = {
      completedTutorialIds: [],
    }

    this.saveProgress()
    this.emit()
  }

  isComplete(tutorialId: string) {
    return this.progress.completedTutorialIds?.includes(tutorialId) ?? false
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