import type { Achievement } from '../../../interfaces/achievements/Achievement.types'
import type { QuestCompletionRequirement } from '../../../interfaces/quests/Quests.types'

interface Props {
  req: QuestCompletionRequirement
  achievement: Achievement
}

export default function QuestRequirementAchievement({
  req,
  achievement
}: Props) {
  if (!req.achievementId) {
    return null
  }

  const checkOrX = req.completed ? '✔' : '✘'

  return (
    <div
      title={achievement.description}
      className="quest-completion-req"
    >
      <div>{checkOrX}</div>

      <div className="quest-completion-req-name">
        Achievement:{' '}
        <strong>{achievement.title}</strong>
      </div>
    </div>
  )
}