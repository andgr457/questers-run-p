import { GAME_LOCAL_STORAGE_KEYS } from '../../../core/data/LocalStorageKeys.data';
import { clockRuntimeService } from '../../clock/ClockRuntimeService';
import { eventBus } from '../EventBus';
import type { GameEvent, GameEventOf } from '../types/EventBus.types';
import { BaseEventService } from './BaseEventService';
import type { WorldContextStorage } from './types/WorldContext.types';

class WorldContextEventService extends BaseEventService {
  private worldContext: WorldContextStorage = {
    characterId: '',
    guildId: ''
  }

  protected onInit() {
    this.load()

    this.startSaveTimer(() => {
      localStorage.setItem(
        GAME_LOCAL_STORAGE_KEYS.WORLD_CONTEXT,
        JSON.stringify(
          this.worldContext
        )
    )})

    eventBus.subscribe(event => {
      if(event.type.includes('world:context:')){
        this.handleEventByType(event)
      }
    })
  }

  private load(){
    const savedData = localStorage.getItem(
      GAME_LOCAL_STORAGE_KEYS.WORLD_CONTEXT
    )
    if(!savedData){
      this.worldContext = {
        characterId: '',
        guildId: ''
      }
    }
    if(savedData){
      const parsed = JSON.parse(savedData) as WorldContextStorage
      this.worldContext = parsed
    }
  }

  private handleEventByType(event: GameEvent) {
    if(event.type === 'world:context:character:add'){
      this.handleCharacterAdd(event)
    }
    if(event.type === 'world:context:guild:add'){
      this.handleGuildAdd(event)
    }
  }

  private handleCharacterAdd(event: GameEventOf<'world:context:character:add'>){
    const characterId = event.meta.characterId
    if(!characterId) return
    this.worldContext.characterId = characterId
    eventBus.emit({
      id: crypto.randomUUID(),
      type: 'world:context:character:added',
      created: clockRuntimeService.getNow(),
      meta: {
        characterId
      }
    })
  }

  private handleGuildAdd(event: GameEventOf<'world:context:guild:add'>){
    const guildId = event.meta.guildId
    if(!guildId) return
    this.worldContext.guildId = guildId
    eventBus.emit({
      id: crypto.randomUUID(),
      type: 'world:context:guild:added',
      created: clockRuntimeService.getNow(),
      meta: {
        guildId
      }
    })
  }

  getWorldContext(): WorldContextStorage {
    return this.worldContext
  }
}

export const worldContextEventService = new WorldContextEventService()