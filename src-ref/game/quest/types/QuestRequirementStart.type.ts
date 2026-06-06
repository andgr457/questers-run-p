import type { Attribute } from '../../attribute/types/Attribute.types'
import type { Stats } from '../../stats/types/Stats.types'

export interface QuestStartRequirement{
  itemId?: string
  itemAmount?: number
  itemCharacterAmount?: number
  itemName?: string
  itemDescription?: string
  achievementId?: string
  achivementTitle?: string
  achivementDescription?: string
  questId?: string
  questTitle?: string
  questDescription?: string
  level?: number
  stats?: Partial<Stats>
  attributes?: Partial<Attribute>
  reqStats?: QuestStartRequirementStat[]
  guildRankLevel?: number
  guildRank?: number
  completed: boolean
}

export interface QuestStartRequirementStat {
  statName: string
  reqAmount: number
  charAmount: number
  completed: boolean
}