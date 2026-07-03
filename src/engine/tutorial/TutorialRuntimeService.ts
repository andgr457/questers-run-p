import { GAME_STORAGE_KEYS } from '../data/local-storage/GameStorageKeys.data'
import { eventBus } from '../event/EventBus'
import { TUTORIALS } from '../../game/tutorial/data/Tutorial.data'
import type { TutorialProgress } from '../../game/tutorial/types/Tutorial.types'
import { notificationRuntimeService } from '../notifications/NotificationRuntimeService'
import { characterRuntimeService } from '../character/CharacterRuntimeService'
import { clockRuntimeService } from '../clock/ClockRuntimeService'

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
    const completedTutorial = TUTORIALS.find(t => t.id === tutorialId)
    if(completedTutorial){
      notificationRuntimeService.notify({
        text: `Tutorial "${completedTutorial.title}" completed!`,
        lifetime: 5000,
        type: 'success'
      })

      if(completedTutorial.rewards.characterSpecific){
        const managedCharacter = characterRuntimeService.getManagingCharacter()
        if(managedCharacter){
          const rewards = completedTutorial.rewards.characterSpecific
          if(rewards.gold){
            eventBus.emit({
              id: crypto.randomUUID(),
              type: 'character:gold',
              meta: {
                characterGoldTransaction: {
                  id: crypto.randomUUID(),
                  characterId: managedCharacter.id,
                  amount: rewards.gold,
                  date: clockRuntimeService.getNow()
                }
              }
            })
          }
          if(rewards.xp){
            eventBus.emit({
              id: crypto.randomUUID(),
              type: 'character:xp',
              meta: {
                xp: rewards.xp,
                characterId: managedCharacter.id
              }
            })
          }
        }
      }

      if(completedTutorial.rewards.charactersAll){
        for(const character of characterRuntimeService.getCharacters()){
          const rewards = completedTutorial.rewards.charactersAll
          if(rewards.gold){
            eventBus.emit({
              id: crypto.randomUUID(),
              type: 'character:gold',
              meta: {
                characterGoldTransaction: {
                  id: crypto.randomUUID(),
                  characterId: character.id,
                  amount: rewards.gold,
                  date: clockRuntimeService.getNow()
                }
              }
            })
          }
          if(rewards.xp){
            eventBus.emit({
              id: crypto.randomUUID(),
              type: 'character:xp',
              meta: {
                xp: rewards.xp,
                characterId: character.id
              }
            })
          }    
        }
      }


      if(completedTutorial.rewards.player){
        const rewards = completedTutorial.rewards.player
        if(rewards.gold){
          eventBus.emit({
            id: crypto.randomUUID(),
            type: 'player:gold',
            meta: {
              playerGoldTransaction: {
                id: crypto.randomUUID(),
                date: clockRuntimeService.getNow(),
                amount: rewards.gold
              }
            }
          })
        }
        if(rewards.xp){
          eventBus.emit({
            id: crypto.randomUUID(),
            type: 'player:xp',
            meta: {
              xp: rewards.xp,
            }
          })
        }
        if(rewards.characterTokens){
          eventBus.emit({
            id: crypto.randomUUID(),
            type: 'player:token',
            meta: {
              characterTokens: rewards.characterTokens,
            }
          })
        }
      }
    }
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