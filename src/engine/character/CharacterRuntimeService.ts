import type { CharacterEntity, CharacterGoldTransaction } from '../../entity/character/types/CharacterEntity.types'
import { GAME_STORAGE_KEYS } from '../data/local-storage/GameStorageKeys.data'
import { eventBus } from '../event/EventBus'
import type { GameEvent } from '../event/types/EventBus.types'
import { notificationRuntimeService } from '../notifications/NotificationRuntimeService'
import { getCharacterGold } from './utils/Character.utils'

class CharacterRuntimeService {
  private initialized = false
  private characters: Record<string, CharacterEntity> = {}
  private dirtyCharacters = new Set<string>()
  private saveInterval: number | undefined
  private characterGoldTransactions: CharacterGoldTransaction[] = []

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
      GAME_STORAGE_KEYS.CHARACTER_GOLD_GAME
    )
    if(charactersGoldValue){
      this.characterGoldTransactions = JSON.parse(charactersGoldValue)
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
      GAME_STORAGE_KEYS.PLAYER_GOLD_GAME,
      JSON.stringify(this.characterGoldTransactions)
    )
    eventBus.emit({
      id: crypto.randomUUID(),
      type: 'character:gold:added'
    })
    notificationRuntimeService.notify({
      text: `Player Gold ${txn.amount < 0 ? '' : '+'}${txn.amount}`,
      type: "info",
      lifetime: 2000
    })
  }

  private addXP(event: GameEvent) {
    const character = this.characters[event.meta?.characterId as string]
    if(!character) return
    if(!event.meta || !event.meta.xp) return
    
    const xp = event.meta?.xp
    notificationRuntimeService.notify({
      text: `Character XP +${xp}`,
      type: "info",
      lifetime: 2000
    })
    const xpWithNew = character.xp + xp
    console.log('character xpWithNew xpNext', xpWithNew, character.xpNextLevel)
    //if over, then level up
    if(xpWithNew >= character.xpNextLevel){
      const differenceXp = xpWithNew - character.xpNextLevel
      console.log('character level up difference xp', differenceXp)

      character.xp = Math.max(differenceXp, 0)
      console.log('character xp to difference', character.xp)
      console.log('character xp next forumula', 'character.xpNextLevel * 1.7', character.xpNextLevel * 1.7)
      character.xpNextLevel = character.xpNextLevel * 1.7
      console.log('player xp next set', character.xpNextLevel)

      character.level += 1
      eventBus.emit({
        id: crypto.randomUUID(),
        type: 'character:level',
        meta: {
          characterId: character.id
        }
      })
      
      notificationRuntimeService.notify({
        text: `Character Level Up ${character.level}`,
        type: "info",
        lifetime: 5000
      })
    } else {
      character.xp += xp
    }

    this.characters[character.id] = character

    this.dirtyCharacters.add(character.id)

    eventBus.emit({
      id: crypto.randomUUID(),
      parentEventId: event.id,
      type: 'character:xp:added'
    })  
  }

  private save(event: GameEvent) {
    const character = event.meta?.character as CharacterEntity

    if (!character) {
      return
    }

    this.characters[character.id] = character

    this.dirtyCharacters.add(character.id)

    eventBus.emit({
      ...event,
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