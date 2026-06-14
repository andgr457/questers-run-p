import type { QuestEntityRequirementComplete, QuestEntityRequirementStart } from './QuestRequirement.type'
import type { QuestEntityReward } from './QuestReward.types'

export interface QuestEntity {
  id: string
  questGroupId: string
  title: React.ReactNode
  description: React.ReactNode
  repeatable: boolean
  rewards: QuestEntityReward[]
  requirements: {
    start: QuestEntityRequirementStart[]
    complete: QuestEntityRequirementComplete[]
  }
}