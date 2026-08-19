import { GAME_LOCAL_STORAGE_KEYS } from '../../../core/data/LocalStorageKeys.data'
import type { GuildMaster } from '../../../entities/guild-master/types/GuildMaster.types'
import { clockRuntimeService } from '../../clock/ClockRuntimeService'
import { eventBus } from '../EventBus'
import type { GameEvent, GameEventOf } from '../types/EventBus.types'
import { BaseEventService } from './BaseEventService'

class GuildMasterEventService extends BaseEventService {
  private guildMasters: Record<string, GuildMaster> = {}

  protected onInit() {

    if(!this.guildMasters){
      this.load()
    }

    eventBus.subscribe(event => {
      if(event.type.includes('player:')){
        this.handleEventByType(event)
      }
    })
  }

  private load() {
    const savedData = localStorage.getItem(
      GAME_LOCAL_STORAGE_KEYS.GUILD_MASTER
    )
    if (savedData) {
      const guildMastersParsed = JSON.parse(savedData) as GuildMaster[]

      this.guildMasters = {}

      for (const gm of guildMastersParsed) {
        this.guildMasters[gm.id] = gm
      }
    }
  }

  getGuildMasterById(id: string): GuildMaster | undefined {
    return this.guildMasters[id]
  }

  private handleEventByType(event: GameEvent) {
    if(event.type === 'gm:create'){
      this.handleCreate(event)
    }
    if(event.type === 'gm:gold:add'){
      this.handleGoldAdd(event)
    }
    if(event.type === 'gm:token:add'){
      this.handleTokenAdd(event)
    }
    if(event.type === 'gm:xp:add'){
      this.handleXPAdd(event)
    }
  }

  private handleCreate(event: GameEventOf<'gm:create'>){
    this.guildMasters[event.meta.guildMaster.id] = event.meta.guildMaster

    this.startSaveTimer(() => {
      localStorage.setItem(
        GAME_LOCAL_STORAGE_KEYS.GUILD_MASTER,
        JSON.stringify(
          Object.values(this.guildMasters)
        )
    )})
    eventBus.emit({
      id: crypto.randomUUID(),
      type: 'gm:created',
      parentEventId: event.id,
      created: clockRuntimeService.getNow(),
      meta: {
        guildMaster: this.guildMasters[event.meta.guildMaster.id]
      }
    })
  }

  private handleTokenAdd(event: GameEventOf<'gm:token:add'>){
    const gm = this.guildMasters[event.meta.guildMasterId]
    if(!gm) return

    gm.tokens += event.meta.amount
    eventBus.emit({
      id: crypto.randomUUID(),
      type: 'gm:token:added',
      parentEventId: event.id,
      created: clockRuntimeService.getNow(),
      meta: {
        ...event.meta
      }
    })
  }

  private handleGoldAdd(event: GameEventOf<'gm:gold:add'>){
    const gm = this.guildMasters[event.meta.guildMasterId]
    if(!gm) return

    gm.gold += event.meta.amount
    eventBus.emit({
      id: crypto.randomUUID(),
      type: 'gm:gold:added',
      parentEventId: event.id,
      created: clockRuntimeService.getNow(),
      meta: {
        ...event.meta
      }
    })
  }

  private handleXPAdd(event: GameEventOf<'gm:xp:add'>){
    const gm = this.guildMasters[event.meta.guildMasterId]
    if(!gm) return

    const xp = event.meta.amount
    if(xp <= 0){
      return
    }

    const xpWithNew = gm.xp + xp
    if(xpWithNew >= gm.xpNextLevel){
      //level up
      console.log('player leveling up')
      console.log('xpWithNewXp', xpWithNew)
      console.log('xpNextLevel', gm.xpNextLevel)

      const leftoverXp = xpWithNew - gm.xpNextLevel
      console.log('player leftover xp', leftoverXp)
      
      //add extra xp to new level
      gm.xp = Math.max(leftoverXp, 0)
      
      //set new xpNextLevel eg = 100 * 1.3
      gm.xpNextLevel = gm.xpNextLevel * 1.3
      console.log('new xpNextLevel', gm.xpNextLevel)
      gm.level += 1
      console.log('new level', gm.level)
      eventBus.emit({
        id: crypto.randomUUID(),
        parentEventId: event.id,
        type: 'gm:level:added',
        created: clockRuntimeService.getNow(),
        meta: {
          guildMasterId: event.meta.guildMasterId,
          level: gm.level
        }
      })
    } else {
      //no level up, just add xp
      gm.xp += xp
    }

    eventBus.emit({
      id: crypto.randomUUID(),
      parentEventId: event.id,
      type: 'gm:xp:added',
      created: clockRuntimeService.getNow(),
      meta: {
        guildMasterId: event.meta.guildMasterId,
        amount: xp
      }
    })
  }
}

export const guildMasterEventService = new GuildMasterEventService()
