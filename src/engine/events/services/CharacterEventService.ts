import { GAME_LOCAL_STORAGE_KEYS } from '../../../core/data/LocalStorageKeys.data'
import type { Character } from '../../../interfaces/Character.types'
import { clockRuntimeService } from '../../clock/ClockRuntimeService'
import { eventBus } from '../EventBus'
import type { GameEvent, GameEventOf } from '../types/EventBus.types'
import { BaseEventService } from './BaseEventService'

class CharacterEventService extends BaseEventService {
  private characters: Record<string, Character> = {}

  protected onInit() {
    this.load()

    this.startSaveTimer(() => {
      localStorage.setItem(
        GAME_LOCAL_STORAGE_KEYS.CHARACTERS,
        JSON.stringify(
          Object.values(this.characters)
        )
    )})

    eventBus.subscribe(event => {
      if(event.type.includes('character:')){
        this.handleEventByType(event)
      }
    })
  }

  private load(){
    const savedData = localStorage.getItem(
      GAME_LOCAL_STORAGE_KEYS.CHARACTERS
    )
    if(savedData){
      const parsed = JSON.parse(savedData) as Character[]
      this.characters = {}
      
      for (const character of parsed) {
        this.characters[character.id] = character
      }
    }
  }

  getCharacters(): Character[] {
    const all = Object.values(this.characters)
    if(!all || all.length === 0) {
      return []
    }

    return all
  }

  getCharactersByGuildId(guildId: string): Character[] {
    const all = Object.values(this.characters)
    if(!all || all.length === 0) {
      console.warn('Character Runtime Service', 'getCharactersByGuildId', guildId, 'No characters related to this guild id.')
      return []
    }

    return all.filter(c => c.guildId === guildId)
  }

  getCharacterById(id: string): Character | undefined {
    return this.characters[id]
  }

  private handleEventByType(event: GameEvent) {
    if(event.type === 'character:create'){
      this.handleCreate(event)
    }
    if(event.type === 'character:gold:add'){
      this.handleGoldAdd(event)
    }
    if(event.type === 'character:attributes:add'){
      this.handleAttributesAdd(event)
    }
    if(event.type === 'character:xp:add'){
      this.handleXPAdd(event)
    }
  }

  private handleCreate(event: GameEventOf<'character:create'>){
    this.characters[event.meta.character.id] = event.meta.character

    eventBus.emit({
      id: crypto.randomUUID(),
      type: 'character:created',
      parentEventId: event.id,
      created: clockRuntimeService.getNow(),
      meta: {
        character: event.meta.character
      }
    })
  }

  private handleAttributesAdd(event: GameEventOf<'character:attributes:add'>){
    const character = this.characters[event.meta.characterId]
    if(!character) return

    const attributes = event.meta.attributes
    if(!attributes) return

    const emissions: (() => void)[] = []

    if(attributes.hp){

    }
    if(attributes.mana){

    }
    if(attributes.stamina){

    }
    if(emissions.length){
      emissions.forEach(fn => fn());
    }
  }

  private handleGoldAdd(event: GameEventOf<'character:gold:add'>){
    const character = this.characters[event.meta.characterId]
    if(!character) return
    const value = event.meta.value
    if(!value) return

    character.gold += value
    eventBus.emit({
      id: crypto.randomUUID(),
      type: 'character:gold:added',
      parentEventId: event.id,
      created: clockRuntimeService.getNow(),
      meta: {
        characterId: character.id,
        value: value
      }
    })
  }

  private handleXPAdd(event: GameEventOf<'character:xp:add'>){
    const character = this.characters[event.meta.characterId]
    if(!character) return
    const value = event.meta.value
    if(!value) return

    const xpWithNew = character.xp.value + value
    const xpNextLevel = character.xp.valueMax
    if(xpWithNew >= xpNextLevel){
      //level up
      console.log('character leveling up', character.id, character.title)
      console.log('xpWithNewXp', xpWithNew)
      console.log('xpNextLevel', xpNextLevel)

      const leftoverXp = xpWithNew - xpNextLevel
      console.log('character leftover xp', leftoverXp)
      
      //add extra xp to new level
      character.xp.value = Math.max(leftoverXp, 0)
      
      //set new xpNextLevel eg = 100 * 1.3 = 130
      character.xp.valueMax = character.xp.valueMax * 1.3

      console.log('new xpNextLevel', character.xp.valueMax)
      character.level += 1
      console.log('new level', character.level)
      eventBus.emit({
        id: crypto.randomUUID(),
        parentEventId: event.id,
        type: 'character:level:added',
        created: clockRuntimeService.getNow(),
        meta: {
          characterId: character.id,
          level: character.level
        }
      })
    } else {
      //no level up, just add xp
      character.xp.value += value
    }
    eventBus.emit({
      id: crypto.randomUUID(),
      parentEventId: event.id,
      type: 'character:xp:added',
      created: clockRuntimeService.getNow(),
      meta: {
        characterId: character.id,
        value: value
      }
    })
  }
}

export const characterEventService = new CharacterEventService()
