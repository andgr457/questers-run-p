import { GAME_LOCAL_STORAGE_KEYS } from '../../../core/data/LocalStorageKeys.data'
import type { Character } from '../../../interfaces/Character.types'
import { clockRuntimeService } from '../../clock/ClockRuntimeService'
import { eventBus } from '../EventBus'
import type { GameEvent, GameEventOf } from '../types/EventBus.types'
import type { WorldModeMain } from '../types/WorldModeEvents.types'
import { BaseEventService } from './BaseEventService'

class CharacterEventService extends BaseEventService {
  private characters: Record<string, Character> = {}

  protected onInit() {
    if(!this.characters){
      this.load()
    }

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
      console.warn('Character Runtime Service', 'getCharacters', 'No characters.')
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
      this.handleGoldAdd(
        event.id,
        this.characters[event.meta.characterId],
        event.meta.value
      )
    }
    if(event.type === 'character:attributes:add'){
      this.handleAttributesAdd(event)
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
    if(attributes.xp.value){
      this.handleXPAdd(event.id, character, attributes.xp.value, emissions)
    }
    if(emissions.length){
      emissions.forEach(fn => fn());
    }
  }

  private handleGoldAdd(
    parentEventId: string,
    character: Character,
    gold: number,
  ){
    if(!gold) return

    character.gold += gold
    eventBus.emit({
      id: crypto.randomUUID(),
      type: 'character:gold:added',
      parentEventId: parentEventId,
      created: clockRuntimeService.getNow(),
      meta: {
        characterId: character.id,
        value: gold
      }
    })
  }

  private handleXPAdd(
    parentEventId: string,
    character: Character,
    xp: number,
    emissions: (() => void)[]
  ){
    if(xp <= 0){
      return
    }

    const xpWithNew = character.attributes.xp.value + xp
    const xpNextLevel = character.attributes.xp.valueMax
    if(xpWithNew >= xpNextLevel){
      //level up
      console.log('character leveling up', character.id, character.title)
      console.log('xpWithNewXp', xpWithNew)
      console.log('xpNextLevel', xpNextLevel)

      const leftoverXp = xpWithNew - xpNextLevel
      console.log('character leftover xp', leftoverXp)
      
      //add extra xp to new level
      character.attributes.xp.value = Math.max(leftoverXp, 0)
      
      //set new xpNextLevel eg = 100 * 1.3 = 130
      character.attributes.xp.valueMax = character.attributes.xp.valueMax * 1.3

      console.log('new xpNextLevel', character.attributes.xp.valueMax)
      character.level += 1
      console.log('new level', character.level)
      emissions.push(
        () => {
          eventBus.emit({
            id: crypto.randomUUID(),
            parentEventId: parentEventId,
            type: 'character:level:added',
            created: clockRuntimeService.getNow(),
            meta: {
              characterId: character.id,
              level: character.level
            }
          })
        }
      )
    } else {
      //no level up, just add xp
      character.attributes.xp.value += xp
    }
    emissions.push(
      () => {
        eventBus.emit({
          id: crypto.randomUUID(),
          parentEventId: parentEventId,
          type: 'character:xp:added',
          created: clockRuntimeService.getNow(),
          meta: {
            characterId: character.id,
            value: xp
          }
        })
      }
    )
  }
}

export const characterEventService = new CharacterEventService()
