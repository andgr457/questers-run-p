import { GAME_LOCAL_STORAGE_KEYS } from '../../../core/data/LocalStorageKeys.data'
import type { Player } from '../../../entities/player/types/Player.types'
import { clockRuntimeService } from '../../clock/ClockRuntimeService'
import { eventBus } from '../EventBus'
import type { GameEvent, GameEventOf } from '../types/EventBus.types'
import type { WorldModeMain, WorldModeOverlay } from '../types/WorldModeEvents.types'
import { BaseEventService } from './BaseEventService'

class WorldModeEventService extends BaseEventService {
  private worldModeMain: WorldModeMain = 'none'
  private worldModeOverlay: WorldModeOverlay = 'intro'

  protected onInit() {
    eventBus.subscribe(event => {
      if(event.type.includes('world:mode')){
        this.handleEventByType(event)
      }
    })
  }
  
  getWorldModeMain(): WorldModeMain {
    return this.worldModeMain
  }

  getWorldModeOverlay(): WorldModeOverlay {
    return this.worldModeOverlay
  }

  private handleEventByType(event: GameEvent) {
    if(event.type === 'world:mode:main:change'){
      this.worldModeMain = event.meta.mode
      eventBus.emit({
        id: crypto.randomUUID(),
        parentEventId: event.id,
        type: 'world:mode:main:changed',
        created: clockRuntimeService.getNow(),
        meta: {
          mode: event.meta.mode
        }
      })
    }
    if(event.type === 'world:mode:overlay:change'){
      this.worldModeOverlay = event.meta.mode
      eventBus.emit({
        id: crypto.randomUUID(),
        parentEventId: event.id,
        type: 'world:mode:overlay:changed',
        created: clockRuntimeService.getNow(),
        meta: {
          mode: event.meta.mode
        }
      })
    }
  }
}

export const worldModeEventService = new WorldModeEventService()
