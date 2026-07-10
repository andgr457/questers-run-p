import type { QuestRequirementComplete, QuestRequirementStart } from './QuestRequirement.type'
import type { QuestReward } from './QuestReward.types'

export interface QuestEntity {
  id: string
  title: React.ReactNode
  description: React.ReactNode
  repeatable: boolean
  rewards: QuestReward[]
  requirements: {
    start: QuestRequirementStart[]
    complete: QuestRequirementComplete[]
  }
}