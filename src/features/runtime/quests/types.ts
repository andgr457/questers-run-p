import type { Achievement } from '../../../interfaces/achievements/Achievement.types'
import type { Character } from '../../../interfaces/characters/Character.types'
import type { Inventory } from '../../../interfaces/inventories/Inventory.types'
import type { Item } from '../../../interfaces/items/Item.types'
import type { MobProgress } from '../../../interfaces/mobs/Mob.types'
import type { Quest, QuestProgress } from '../../../interfaces/quests/Quests.types'

export interface QuestRulesContext {
  quest: Quest
  character: Character

  questProgress: QuestProgress[]
  inventories: Inventory[]
  mobProgress: MobProgress[]

  items: Item[]
  achievements: Achievement[]

  now: number
}

export interface QuestRulesResult {
  questProgress: QuestProgress | null

  startRequirements: any
  completionRequirements: any

  canTakeQuest: boolean
  canCompleteQuest: boolean
  inProgress: boolean
}