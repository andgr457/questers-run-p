
import type { Loot } from '../../../interfaces/mobs/Mob.types'
import type { HuntingEvent } from './HuntingEvent'

export interface HuntingEncounterResult {
  characterPassedOut: boolean

  finalCharacterHp: number

  finalMobHp: number

  loot: Loot[]

  events: HuntingEvent[]
}