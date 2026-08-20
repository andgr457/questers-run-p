import { clockRuntimeService } from '../../clock/ClockRuntimeService'
import { eventBus } from '../EventBus'
import type { GameEvent } from '../types/EventBus.types'
import type { WorldModeMain, WorldModeOverlay } from '../types/WorldModeEvents.types'
import { BaseEventService } from './BaseEventService'

class WorldModeEventService extends BaseEventService {
  private worldModeMain: WorldModeMain = 'none'
  private worldModeOverlay: WorldModeOverlay = 'intro'
  private transitionText = `Quester's Run`
  private transitionOnCompleteMode: WorldModeMain = 'none'

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

  getTransitionText(): string {
    return this.transitionText
  }

  getTransitionOnCompleteMode(): WorldModeMain {
    return this.transitionOnCompleteMode
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
          ...event.meta
        }
      })
    }
    if(event.type === 'world:mode:overlay:change'){
      this.transitionOnCompleteMode = event.meta.transitionOnCompleteMode
      this.transitionText = event.meta.transitionText
      this.worldModeOverlay = event.meta.mode
      eventBus.emit({
        id: crypto.randomUUID(),
        parentEventId: event.id,
        type: 'world:mode:overlay:changed',
        created: clockRuntimeService.getNow(),
        meta: {
          ...event.meta
        }
      })
    }
  }
}

export const worldModeEventService = new WorldModeEventService()
