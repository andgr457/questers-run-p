import type { CharacterEntity, CharacterGoldTransaction } from '../../entity/character/types/CharacterEntity.types'
import { GAME_STORAGE_KEYS } from '../data/local-storage/GameStorageKeys.data'
import { eventBus } from '../event/EventBus'
import type { GameEvent } from '../event/types/EventBus.types'
import { getCharacterGold } from '../../entity/character/utils/Character.utils'
import { tutorialRuntimeService } from '../tutorial/TutorialRuntimeService'
import { GAME_TUTORIAL_IDS } from '../../game/tutorial/data/Tutorial.data'

class CharacterRuntimeService {
  private initialized = false
  private characters: Record<string, CharacterEntity> = {}
  private dirtyCharacters = new Set<string>()
  private saveInterval: number | undefined
  private characterGoldTransactions: CharacterGoldTransaction[] = []
  private managedCharacterId: string | undefined

  init() {
    if (this.initialized) {
      return
    }

    this.initialized = true

    const charactersValue = localStorage.getItem(
      GAME_STORAGE_KEYS.CHARACTERS_GAME
    )

    if (charactersValue) {
      const characters = JSON.parse(charactersValue) as CharacterEntity[]

      this.characters = {}

      for (const character of characters) {
        this.characters[character.id] = character
      }
    }

    const charactersGoldValue = localStorage.getItem(
      GAME_STORAGE_KEYS.CHARACTERS_GOLD_GAME
    )
    if(charactersGoldValue){
      this.characterGoldTransactions = JSON.parse(charactersGoldValue)
    }

    const charactersManagedValue = localStorage.getItem(
      GAME_STORAGE_KEYS.CHARACTER_MANAGED_GAME
    )
    if(charactersManagedValue){
      const {managedCharacterId} = JSON.parse(charactersManagedValue)
      this.managedCharacterId = managedCharacterId
    }

    eventBus.subscribe(event => {
      if (event.type === 'character:save') {
        this.save(event)
      }
      if(event.type === 'character:gold'){
        this.addGoldTransaction(event)
      }
      if(event.type === 'character:xp'){
        this.addXP(event)
      }
      if(event.type === 'character:upgrade'){
        this.addUpgrade(event)
      }
      if(event.type === 'character:manage'){
        this.managedCharacterId = event.meta?.characterId
        localStorage.setItem(
          GAME_STORAGE_KEYS.CHARACTER_MANAGED_GAME,
          JSON.stringify({managedCharacterId: event.meta?.characterId})
        )
        eventBus.emit({
          id: crypto.randomUUID(),
          parentEventId: event.id,
          type: 'character:manage:added'
        })
      }
    })
  }

  start() {
    if (this.saveInterval) {
      return
    }

    this.saveInterval = window.setInterval(() => {
      this.flushDirtyCharacters()
    }, 5000)
  }

  stop() {
    if (!this.saveInterval) {
      return
    }

    clearInterval(this.saveInterval)

    this.saveInterval = undefined
  }

  getCharacter(id: string) {
    return this.characters[id]
  }

  getCharacters() {
    return Object.values(this.characters)
  }

  saveCharacter(character: CharacterEntity) {
    eventBus.emit({
      id: crypto.randomUUID(),
      type: 'character:save',
      meta: {
        character
      }
    })
  }

  getManagingCharacter(): CharacterEntity | undefined {
    if(!this.managedCharacterId) return undefined
    return this.characters[this.managedCharacterId]
  }

  getCharacterGoldTransactions(characterId: string){
    return this.characterGoldTransactions.filter(txn => txn.characterId === characterId)
  }

  private addGoldTransaction(event: GameEvent) {
    const txn = event.meta?.characterGoldTransaction as CharacterGoldTransaction
    if(txn.amount < 0){
      const characterGold = getCharacterGold(txn.characterId)
      const wouldBeAmount = characterGold + txn.amount

      if(wouldBeAmount < 0){
        return
      }
    }
    this.characterGoldTransactions = [
      txn,
      ...this.characterGoldTransactions
    ]

    localStorage.setItem(
      GAME_STORAGE_KEYS.CHARACTERS_GOLD_GAME,
      JSON.stringify(this.characterGoldTransactions)
    )
    eventBus.emit({
      id: crypto.randomUUID(),
      type: 'character:gold:added',
      meta: {
        characterId: txn.characterId,
        gold: txn.amount
      }
    })
  }

  private addUpgrade(event: GameEvent){
    const character = this.characters[event.meta?.characterId as string]
    if(!character) return
    if(!event.meta || !event.meta.characterUpgrade) return

    
  }

  private addXP(event: GameEvent) {
    const character = this.characters[event.meta?.characterId as string]
    if(!character) return
    if(!event.meta || !event.meta.xp) return
    
    const xp = event.meta?.xp
    const xpWithNew = character.xp + xp
    console.log('character xpWithNew xpNext', xpWithNew, character.xpNextLevel)
    //if over, then level up
    if(xpWithNew >= character.xpNextLevel){
      const differenceXp = xpWithNew - character.xpNextLevel
      console.log('character level up difference xp', differenceXp)

      character.xp = Math.max(differenceXp, 0)
      console.log('character xp to difference', character.xp)
      console.log('character xp next forumula', 'character.xpNextLevel * 1.7', character.xpNextLevel * 1.7)
      character.xpNextLevel = character.xpNextLevel * 1.2
      console.log('player xp next set', character.xpNextLevel)

      character.level += 1
      eventBus.emit({
        id: crypto.randomUUID(),
        type: 'character:level',
        meta: {
          characterId: character.id,
          level: character.level
        }
      })
      eventBus.emit({
        id: crypto.randomUUID(),
        type: 'notification:save',
        meta: {
          notification: {
            title: 'Character Event',
            description: `${character.name} is now level ${character.level}!`
          }
        }
      })
    } else {
      character.xp += xp
    }

    this.characters[character.id] = character

    this.dirtyCharacters.add(character.id)

    eventBus.emit({
      id: crypto.randomUUID(),
      parentEventId: event.id,
      type: 'character:xp:added',
      meta: {
        characterId: character.id,
        xp
      }
    })  
  }

  private save(event: GameEvent) {
    const character = event.meta?.character as CharacterEntity

    if (!character) {
      return
    }

    this.characters[character.id] = character

    this.dirtyCharacters.add(character.id)

    //check tutorial completion
    const currentTutorial = tutorialRuntimeService.getCurrentTutorial()
    if(currentTutorial?.id === GAME_TUTORIAL_IDS.TUTORIAL_001_CHARACTER_FIRST_CREATE){
      if(Object.getOwnPropertyNames(this.characters).length >= 1){
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
    }
    eventBus.emit({
      id: crypto.randomUUID(),
      parentEventId: event.id,
      type: 'character:saved',
      meta: {
        ...event.meta,
        character
      }
    })
  }

  private flushDirtyCharacters() {
    if (this.dirtyCharacters.size === 0) {
      return
    }

    localStorage.setItem(
      GAME_STORAGE_KEYS.CHARACTERS_GAME,
      JSON.stringify(
        Object.values(this.characters)
      )
    )

    this.dirtyCharacters.clear()
  }
}

export const characterRuntimeService =
  new CharacterRuntimeService()