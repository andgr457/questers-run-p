import { GAME_LOCAL_STORAGE_KEYS } from '../../../core/data/LocalStorageKeys.data'
import type { Guild } from '../../../interfaces/Guild.types'
import { clockRuntimeService } from '../../clock/ClockRuntimeService'
import { eventBus } from '../EventBus'
import type { GameEvent, GameEventOf } from '../types/EventBus.types'
import { BaseEventService } from './BaseEventService'

class GuildEventService extends BaseEventService {
  private guilds: Record<string, Guild> = {}

  protected onInit() {
    this.load()

    this.startSaveTimer(() => {
      localStorage.setItem(
        GAME_LOCAL_STORAGE_KEYS.GUILDS,
        JSON.stringify(
          Object.values(this.guilds)
        )
    )})

    eventBus.subscribe(event => {
      if(event.type.includes('guild:')){
        this.handleEventByType(event)
      }
    })
  }

  private load(){
    const savedData = localStorage.getItem(
      GAME_LOCAL_STORAGE_KEYS.GUILDS
    )
    if(!savedData){
      this.guilds = {}
    }
    if(savedData){
      const parsed = JSON.parse(savedData) as Guild[]

      for (const guild of parsed) {
        this.guilds[guild.id] = guild
      }
    }
  }

  getGuilds(): Guild[] {
    const all = Object.values(this.guilds)
    if(!all || all.length === 0) {
      return []
    }

    return all
  }


  getGuildById(id: string): Guild | undefined {
    return this.guilds[id]
  }

  private handleEventByType(event: GameEvent) {
    if(event.type === 'guild:create'){
      this.handleCreate(event)
    }
    if(event.type === 'guild:gold:add'){
      this.handleGoldAdd(event)
    }
    if(event.type === 'guild:xp:add'){
      this.handleXPAdd(event)
    }
  }

  private handleCreate(event: GameEventOf<'guild:create'>){
    this.guilds[event.meta.guild.id] = event.meta.guild

    eventBus.emit({
      id: crypto.randomUUID(),
      type: 'guild:created',
      parentEventId: event.id,
      created: clockRuntimeService.getNow(),
      meta: {
        guildId: event.meta.guildId,
        guild: event.meta.guild
      }
    })
  }

  private handleGoldAdd(event: GameEventOf<'guild:gold:add'>){
    const guild = this.guilds[event.meta.guildId]
    if(!guild) return
    const value = event.meta.value
    if(!value) return

    guild.gold += value
    eventBus.emit({
      id: crypto.randomUUID(),
      type: 'guild:gold:added',
      parentEventId: event.id,
      created: clockRuntimeService.getNow(),
      meta: {
        guildId: guild.id,
        value: value
      }
    })
  }

  private handleXPAdd(event: GameEventOf<'guild:xp:add'>){
    const guild = this.guilds[event.meta.guildId]
    if(!guild) return
    const value = event.meta.value
    if(!value) return

    const xpWithNew = guild.xp.value + value
    const xpNextLevel = guild.xp.valueMax
    if(xpWithNew >= xpNextLevel){
      //level up
      console.log('guild leveling up', guild.id, guild.title)
      console.log('xpWithNewXp', xpWithNew)
      console.log('xpNextLevel', xpNextLevel)

      const leftoverXp = xpWithNew - xpNextLevel
      console.log('guild leftover xp', leftoverXp)
      
      //add extra xp to new level
      guild.xp.value = Math.max(leftoverXp, 0)
      
      //set new xpNextLevel eg = 100 * 1.3 = 130
      guild.xp.valueMax = guild.xp.valueMax * 1.3

      console.log('new xpNextLevel', guild.xp.valueMax)
      guild.level += 1
      console.log('new level', guild.level)
      eventBus.emit({
        id: crypto.randomUUID(),
        parentEventId: event.id,
        type: 'guild:level:added',
        created: clockRuntimeService.getNow(),
        meta: {
          guildId: guild.id,
          level: guild.level
        }
      })
    } else {
      //no level up, just add xp
      guild.xp.value += value
    }
    eventBus.emit({
      id: crypto.randomUUID(),
      parentEventId: event.id,
      type: 'guild:xp:added',
      created: clockRuntimeService.getNow(),
      meta: {
        guildId: guild.id,
        value: value
      }
    })
  }
}

export const guildEventService = new GuildEventService()
