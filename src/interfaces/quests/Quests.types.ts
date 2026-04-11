import type { Character, Stats } from '../characters/Character.types'

export interface QuestGroup {
  id: string
  title: string
  description: string
}

export interface QuestCompleteProps {
  character: Character
  achievementId: string
  valueToCheck: unknown
  expectedValue: unknown
}

export interface Quest {
  id: string
  groupId: string
  title: string
  description: string
  requiresQuestId: string
  requiresLevel: number
  maxPartyMembers: number
  requiredStats: Stats
  questRewardIds: QuestReward[]
  startedDate?: string
  completedDate?: string
  canComplete: (props: QuestCompleteProps) => boolean
}

export interface QuestReward {
  itemId: string
  amount: number
}

export type QuestProgressStatus = 'in-progress' | 'complete'

export interface QuestProgress {
  questId: string
  startDate: string
  status: QuestProgressStatus
}