import { GAME_TUTORIALS } from '../../game/tutorial/data/Tutorial.data'
import type { Tutorial, TutorialProgress } from '../../game/tutorial/types/Tutorial.types'
import { characterRuntimeService } from '../character/CharacterRuntimeService'
import { clockRuntimeService } from '../clock/ClockRuntimeService'
import { GAME_STORAGE_KEYS } from '../data/local-storage/GameStorageKeys.data'
import { eventBus } from '../event/EventBus'
import type { GameEvent } from '../event/types/EventBus.types'

class TutorialRuntimeService {
  private initialized = false

  private progress: TutorialProgress = {
    playerTutorialProgress: [],
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
      if(event.type === 'tutorial:collect'){
        this.collectTutorialRewards(event)
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
    eventBus.emit({
      id: crypto.randomUUID(),
      type: 'notification:save',
      meta: {
        notification: {
          title: 'Tutorial Event',
          description: `Completed tutorial "${tutorial.title}".`
        }
      }
    })
  }

  completeTutorial(event: GameEvent) {
    const tutorialId = event.meta?.tutorialId
    if(!tutorialId || this.isCompleted(tutorialId)){
      return
    }

    this.progress.playerTutorialProgress.push({
      tutorialId,
      collected: false,
      completed: true,
      dateCompleted: clockRuntimeService.getNow()
    })

    const tutorial = GAME_TUTORIALS.find(t => t.id === tutorialId)
    if(!tutorial) return

    this.saveProgress()
    this.emitCompleted(event, tutorial)
  }

  collectTutorialRewards(event: GameEvent){
    const tutorialId = event.meta?.tutorialId
    if(!tutorialId || this.isCollected(tutorialId)){
      return
    }
    
    const existingProgress = this.progress.playerTutorialProgress.find(t => 
      t.tutorialId === tutorialId
    )
    if(existingProgress?.collected === true){
      return
    }

    const tutorial = GAME_TUTORIALS.find(t => t.id === tutorialId)
    if(!tutorial) return

    eventBus.emit({
      id: crypto.randomUUID(),
      type: 'rewards:start',
      meta: {
        tutorialRewards: tutorial.rewards,
        characterId: characterRuntimeService.getManagingCharacter()?.id
      },
    })
  }

  isCompleted(tutorialId: string) {
    return this.progress.playerTutorialProgress?.find(t => t.tutorialId === tutorialId)?.completed === true
  }

  isCollected(tutorialId: string){
    return this.progress.playerTutorialProgress?.find(t => t.tutorialId === tutorialId)?.collected === true
  }

  getProgress() {
    return {
      ...this.progress,
    }
  }

  getCurrentTutorial() {
    return GAME_TUTORIALS.find(
      tutorial => !this.isCompleted(tutorial.id)
    )
  }
}

export const tutorialRuntimeService =
  new TutorialRuntimeService()