import { GAME_LOCAL_STORAGE_KEYS } from '../../../core/data/LocalStorageKeys.data'
import type { Player } from '../../../entities/player/types/Player.types'
import { clockRuntimeService } from '../../clock/ClockRuntimeService'
import { eventBus } from '../EventBus'
import type { GameEvent, GameEventOf } from '../types/EventBus.types'
import { BaseEventService } from './BaseEventService'

class PlayerEventService extends BaseEventService {
  private player: Player | undefined

  protected onInit() {
    this.startSaveTimer(() => {
      localStorage.setItem(
      GAME_LOCAL_STORAGE_KEYS.PLAYER,
      JSON.stringify(this.player)
    )})
    
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
    if(event.type === 'player:gold:add'){
      this.handlePlayerGoldAdd(event)
    }
    if(event.type === 'player:token:add'){
      this.handlePlayerTokenAdd(event)
    }
    if(event.type === 'player:xp:add'){
      this.handlePlayerXPAdd(event)
    }
  }

  private handlePlayerCreate(event: GameEventOf<'player:create'>){
    this.player = event.meta.player
    eventBus.emit({
      id: crypto.randomUUID(),
      type: 'player:created',
      parentEventId: event.id,
      created: clockRuntimeService.getNow(),
      meta: {
        player: this.player
      }
    })
  }

  private handlePlayerTokenAdd(event: GameEventOf<'player:token:add'>){
    if(!this.player) return

    this.player.tokens += event.meta.amount
    eventBus.emit({
      id: crypto.randomUUID(),
      type: 'player:token:added',
      parentEventId: event.id,
      created: clockRuntimeService.getNow(),
      meta: {
        amount: event.meta.amount
      }
    })
  }

  private handlePlayerGoldAdd(event: GameEventOf<'player:gold:add'>){
    if(!this.player) return

    this.player.gold += event.meta.amount
    eventBus.emit({
      id: crypto.randomUUID(),
      type: 'player:gold:added',
      parentEventId: event.id,
      created: clockRuntimeService.getNow(),
      meta: {
        amount: event.meta.amount
      }
    })
  }

  private handlePlayerXPAdd(event: GameEventOf<'player:xp:add'>){
    if(!this.player) return

    const xp = event.meta.amount
    if(xp <= 0){
      return
    }

    const xpWithNew = this.player.xp + xp
    if(xpWithNew >= this.player.xpNextLevel){
      //level up
      console.log('player leveling up')
      console.log('xpWithNewXp', xpWithNew)
      console.log('xpNextLevel', this.player.xpNextLevel)

      const leftoverXp = xpWithNew - this.player.xpNextLevel
      console.log('player leftover xp', leftoverXp)
      
      //add extra xp to new level
      this.player.xp = Math.max(leftoverXp, 0)
      
      //set new xpNextLevel eg = 100 * 1.3
      this.player.xpNextLevel = this.player.xpNextLevel * 1.3
      console.log('new xpNextLevel', this.player.xpNextLevel)
      this.player.level += 1
      console.log('new level', this.player.level)
      eventBus.emit({
        id: crypto.randomUUID(),
        parentEventId: event.id,
        type: 'plpayer:level:added',
        created: clockRuntimeService.getNow(),
        meta: {
          level: this.player.level
        }
      })
    } else {
      //no level up, just add xp
      this.player.xp += xp
    }

    eventBus.emit({
      id: crypto.randomUUID(),
      parentEventId: event.id,
      type: 'player:xp:added',
      created: clockRuntimeService.getNow(),
      meta: {
        amount: xp
      }
    })
  }

  private handleSave = () => {
    console.log('saving player')
    localStorage.setItem(
      GAME_LOCAL_STORAGE_KEYS.PLAYER,
      JSON.stringify(this.player)
    )
  }

  private handleLoad = () => {
    // ...
  }
}

export const playerEventService = new PlayerEventService()
