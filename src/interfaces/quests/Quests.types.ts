import type { Character, Stats } from '../characters/Character.types'

export interface QuestGroup {
  id: string
  title: string
  description: string
}

export interface QuestCompleteProps {
  character?: Character
  achievementId?: string
  valueToCheck?: unknown
  expectedValue?: unknown
  gathering: {
    itemId: string
    amountRequired: string
  }
}

export interface Quest {
  id: string
  groupId: string
  title: string
  description: string
  repeatable: boolean
  rewards: QuestReward[]
  startRequirements: QuestStartRequirement[]
  completionRequirements: QuestCompletionRequirement[]
  cooldownMinutes: number
}

export interface QuestStartRequirementStat {
  statName: string
  reqAmount: number
  charAmount: number
  completed: boolean
}

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
  reqStats?: QuestStartRequirementStat[]
  guildRankLevel?: number
  guildRank?: number
  completed: boolean
}

export interface QuestCompletionRequirement{
  itemId?: string
  itemAmount?: number
  itemCharacterAmount?: number
  itemName?: string
  itemDescription?: string
  itemProfessionType?: string
  achievementId?: string
  achievementTitle?: string
  achievementDescription?: string
  timeSeconds?: number
  timeMinutes?: number
  timeHours?: number
  mobId?: string
  mobName?: string
  mobDescription?: string
  mobLevel?: number
  mobAmount?: number
  mobCharacterAmount?: number
  mobLocationType?: string
  completed: boolean
}

export interface QuestRewardProgressItem extends QuestReward {
  itemName?: string
  achievementTitle?: string
}

export interface QuestReward {
  xp?: number
  itemId?: string
  itemAmount?: number
  achivementId?: string
}

export type QuestProgressStatus = 'in-progress' | 'complete'

export interface QuestProgress {
  id: string
  questId: string
  characterId: string
  status: QuestProgressStatus
  startDate: string
  endDate?: string
}

export interface QuestRewardUI {
  xp?: number

  itemId?: string
  itemName?: string
  itemAmount?: number

  achievementId?: string
  achievementTitle?: string
}