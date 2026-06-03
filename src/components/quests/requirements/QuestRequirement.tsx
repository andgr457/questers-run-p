import type { Achievement } from '../../../interfaces/achievements/Achievement.types'
import type { Item } from '../../../interfaces/items/Item.types'
import type { Mob } from '../../../interfaces/mobs/Mob.types'
import type { QuestCompletionRequirement } from '../../../interfaces/quests/Quests.types'
import type { QuestRequirementObjectsForUI } from '../utils/questRequirements.utils'
import QuestRequirementAchievement from './QuestRequirementAchievement'
import QuestRequirementItem from './QuestRequirementItem'
import QuestRequirementMob from './QuestRequirementMob'
import QuestRequirementTimer from './QuestRequirementTimer'

interface Props {
  req: QuestCompletionRequirement
  requirementData: QuestRequirementObjectsForUI
  startDate?: string
  now: number
}

export default function QuestRequirement({
  req,
  startDate,
  now,
  requirementData
}: Props) {
const type =
  req.timeMinutes
    ? 'time'
    : req.itemId
      ? 'item'
      : req.mobId
        ? 'mob'
        : req.achievementId
          ? 'achievement'
          : null
  switch (type) {
    case 'time':
      return (
        <QuestRequirementTimer
          req={req}
          startDate={startDate}
          now={now}
        />
      )

    case 'item':
      return <QuestRequirementItem 
        req={req} 
        item={requirementData.questItems.find(i => i.id === req.itemId) as Item} 
      />

    case 'mob':
      return <QuestRequirementMob 
        req={req} 
        mob={requirementData.questMobs.find(m => m.id === req.mobId) as Mob} 
      />

    case 'achievement':
      return <QuestRequirementAchievement 
        req={req} 
        achievement={requirementData.questAchievements.find(a => a.id === req.achievementId) as Achievement} 
      />

    default:
      return null
  }
}