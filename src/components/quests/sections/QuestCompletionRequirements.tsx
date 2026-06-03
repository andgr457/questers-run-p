import QuestRequirement from '../requirements/QuestRequirement'
import type { QuestCompletionRequirement } from '../../../interfaces/quests/Quests.types'
import type { QuestRequirementObjectsForUI } from '../utils/questRequirements.utils'

interface QuestCompletionRequirementsProps {
  requirements: QuestCompletionRequirement[]
  requirementData: QuestRequirementObjectsForUI
  questId: string
  startDate?: string
  now: number
}

export default function QuestCompletionRequirements({
  requirements,
  questId,
  startDate,
  now,
  requirementData
}: QuestCompletionRequirementsProps) {
  const completedCount =
    requirements.filter(r => r.completed).length

  const total = requirements.length

  return (
    <div>
      <div
        className={`quest-item-requirements-header ${
          completedCount === total ? 'success' : ''
        }`}
      >
        {completedCount} / {total} Completed Requirements
      </div>

      <div className="quest-item-requirements-list">
        {requirements.map((r, index) => (
          <QuestRequirement
            key={`${questId}_completion_${index}`}
            req={r}
            startDate={startDate}
            now={now}
            requirementData={requirementData}
          />
        ))}
      </div>
    </div>
  )
}