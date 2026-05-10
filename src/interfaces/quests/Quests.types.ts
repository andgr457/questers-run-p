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

export interface QuestStartRequirement{
  itemId?: string
  itemAmount?: number
  achievementId?: string
  questId?: string
  level?: number
  stats?: Stats
  completed: boolean
}

export interface QuestCompletionRequirement{
  itemId?: string
  itemAmount?: number
  achievementId?: string
  timeMinutes?: number
  completed: boolean
}

export interface QuestReward {
  xp?: number
  itemId?: string
  itemAmount?: number
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