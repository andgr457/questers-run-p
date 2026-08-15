import { GAME_LOCAL_STORAGE_KEYS } from '../../../core/data/LocalStorageKeys.data'
import type { Player } from '../../../entities/player/types/Player.types'
import { clockRuntimeService } from '../../clock/ClockRuntimeService'
import { eventBus } from '../EventBus'
import type { GameEvent, GameEventOf } from '../types/EventBus.types'
import { BaseEventService } from './BaseEventService'

class FloatingTextEventService extends BaseEventService {
  private player: Player | undefined

  protected onInit() {
    eventBus.subscribe(event => {
      if(event.type.includes('player:')){
        this.handleEventByType(event)
      }
    })
  }

  getPlayer(): Player | undefined {
    return this.player
  }

  private handleEventByType(event: GameEvent) {
    if(event.type === 'player:create'){
      this.handlePlayerCreate(event)
    }
  }

  private handlePlayerCreate(event: GameEventOf<'player:create'>){
    const newPlayer = event.meta.player
    localStorage.setItem(
      GAME_LOCAL_STORAGE_KEYS.PLAYER,
      JSON.stringify(newPlayer)
    )
    this.player = newPlayer
    eventBus.emit({
      id: crypto.randomUUID(),
      type: 'player:created',
      parentEventId: event.id,
      created: clockRuntimeService.getNow(),
      meta: {
        player: newPlayer
      }
    })
  }

  private handleSave = () => {
    // ...
  }

  private handleLoad = () => {
    // ...
  }
}

export const floatingTextEventService = new FloatingTextEventService()
