import type { CharacterEntity } from '../../../entity/character/types/CharacterEntity.types'
import type { PlayerEntity } from '../../../entity/player/types/PlayerEntity.types'
import type { QuestEntity } from '../../../entity/quest/types/QuestEntity.types'

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
  eventId?: string
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
  mode?: string
  
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

  //upgrades
  upgradeId?: string
  
  player?: PlayerEntity
  character?: CharacterEntity
  quest?: QuestEntity
}