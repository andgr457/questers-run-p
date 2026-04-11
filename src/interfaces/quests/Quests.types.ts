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
  maxPartyMembers: number
  rewards: QuestReward[]
  requirements: QuestRequirement[]
  cooldownMinutes: number
  requiredQuestId: string
  requiredLevel: number
  requiredStats: Stats
}

export interface QuestRequirement{
  itemId?: string
  itemAmount?: number
  achievementId?: string
  timeMinutes?: number
}

export interface QuestReward {
  xp?: number
  itemId?: string
  itemAmount?: number
}

export type QuestProgressStatus = 'in-progress' | 'complete'

export interface QuestProgress {
  questId: string
  characterId: string
  status: QuestProgressStatus
  startDate: string
  endDate?: string
}