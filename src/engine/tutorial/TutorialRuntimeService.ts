import { GAME_TUTORIALS } from '../../game/tutorial/data/Tutorial.data'
import type { Tutorial, TutorialProgress } from '../../game/tutorial/types/Tutorial.types'
import { characterRuntimeService } from '../character/CharacterRuntimeService'
import { GAME_STORAGE_KEYS } from '../data/local-storage/GameStorageKeys.data'
import { eventBus } from '../event/EventBus'
import type { GameEvent } from '../event/types/EventBus.types'
import { notificationRuntimeService } from '../notification/NotificationRuntimeService'

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
      if(!event.type.includes('tutorial:')) return

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

  private emitCompleted(event: GameEvent, tutorial: Tutorial) {
    eventBus.emit({
      id: crypto.randomUUID(),
      type: 'tutorial:completed',
      parentEventId: event.id
    })
    notificationRuntimeService.addHistory(
      'Tutorial Event',
      `Completed tutorial "${tutorial.title}".`
    )
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
    if(!tutorial) return

    if (tutorial.rewards.length > 0) {
      eventBus.emit({
        id: crypto.randomUUID(),
        type: 'rewards:start',
        meta: {
          tutorialRewards: tutorial.rewards,
          characterId: characterRuntimeService.getManagingCharacter()?.id
        },
      })
    }

    this.saveProgress()
    this.emitCompleted(event, tutorial)
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