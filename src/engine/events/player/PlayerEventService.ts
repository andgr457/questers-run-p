import { DateTime } from 'luxon';
import type { Player } from '../../../entities/player/Player.types';
import { db } from '../../db/dexie.db';
import { BaseEventService } from '../BaseEventService';
import { eventBus } from '../EventBus';
import type { EventOf, GameEvent } from '../EventBus.types';

class PlayerEventService extends BaseEventService {
  private player: Player | undefined

  protected async onInit(): Promise<void> {
    this.player = await db.player.get(1)
    
    eventBus.subscribe(async (event) => {
      if(event.type.includes('player:')){
        await this.handleEventsByType(event)
      }
    })
  }

  getPlayer(): Player | undefined {
    return this.player
  }

  private async handleEventsByType(event: GameEvent){
    if(event.type === 'player:create'){
      this.handleCreate(event)
    }
  }

  private async handleCreate(event: EventOf<'player:create'>){
    try {
      //todo dexie isn't respecting the forced index
      const newId = await db.player.put(event.meta.player)
      this.player = await db.player.get(newId)
      console.log('created new player', newId, this.player)
      eventBus.emit({
        type: 'player:created',
        meta: {
          player: this.player as Player
        }
      })
    }catch(error){
      console.error('Failed to create player', error)
    }
  }

  protected async startSaveTimer(): Promise<void> {
    const saveLoop = async () => {
      if(this.player){
        try {
          this.player.dateSaved = DateTime.utc().toMillis()
          await db.player.put({id: this.player.id, ...this.player})
        }catch(error){
          console.error('Player auto-save failed', error)
        }
      }
      // schedule next save 10 seconds AFTER the current save completes
      window.setTimeout(saveLoop, 10000)
    }

    //start the first loop 10 second from now
    window.setTimeout(saveLoop, 10000)
  }

}

export const playerEventService = new PlayerEventService()