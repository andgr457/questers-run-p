import type { PlayerEntity } from '../../../entities/player/types/PlayerEntity.types'

export type ActivityType =
  | 'hunting'
  | 'questing'
  | 'gathering'
  | 'mining'
  | 'cooking'
  | 'crafting'
  | 'dungeon'
  | 'raid'
  | 'resting'

export type ActivityStatus =
  | 'active'
  | 'completed'
  | 'cancelled'

export interface ActivityEntry {
  id: string
  characterId: string
  type: ActivityType
  startedAt: number
  status: ActivityStatus
  blocking?: boolean
  blockingAll?: boolean
  duration: number
  continuous: boolean
  completedAt?: number

  meta?: ActivityMeta
}

export type ActivityMeta = {

  // generic naming
  name?: string

  // questing
  questId?: string
  questName?: string

  // resting
  tavernActionId?: string

  // hunting
  mobId?: string
  mobName?: string
  zoneId?: string
  zoneName?: string

  // professions
  professionId?: string
  professionName?: string

  // crafting
  recipeId?: string
  recipeName?: string
  itemId?: string
  itemName?: string

  // dungeon / raid
  dungeonId?: string
  dungeonName?: string
  raidId?: string
  raidName?: string

  // generic runtime values
  xpReward?: number
  goldReward?: number

  player?: PlayerEntity

}