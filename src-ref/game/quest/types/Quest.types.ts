import type { QuestStartRequirement } from './QuestRequirementStart.type'
import type { QuestCompleteRequirement } from './QuestRequirementComplete.types'
import type { QuestReward } from './QuestReward.types'

export interface QuestGroup {
  id: string
  title: string
  description: string
}

export interface Quest {
  id: string
  groupId: string
  title: string
  description: string
  repeatable: boolean
  rewards: QuestReward[]
  startRequirements: QuestStartRequirement[]
  completionRequirements: QuestCompleteRequirement[]
  cooldown: number
}

export type QuestAction = 'take'
  | 'complete'
  | 'abandon'
