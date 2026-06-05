import { useQuestTimer }
  from '../../../hooks/useQuestTimer'
import type { QuestCompletionRequirement } from '../../../interfaces/quests/Quests.types'

interface Props {
  req: QuestCompletionRequirement
  startDate?: string
  now: number
}

export default function QuestRequirementTimer({
  req,
  startDate,
  now,
}: Props) {

  const {
    progressPercent,
    leftSeconds,
    isActive,
  } = useQuestTimer({
    startDate,
    timeMinutes: req.timeMinutes,
    now,
  })

  return (
    <div
      className={
        req.completed
          ? 'quest-item-requirements-item completed'
          : 'quest-item-requirements-item'
      }
    >
      <div>
        {req.completed ? '✔' : '✘'}

        <strong>
          {req.timeMinutes}
        </strong>

        {' '}min

        {isActive && (
          <>
            {' '}|
            {' '}
            {progressPercent.toFixed(1)}
            %
            {' '}
            {leftSeconds.toFixed(1)}
            sec remaining...
          </>
        )}
      </div>

      {isActive && (
        <div className="character-stat-card-bar attribute-bar">
          <div
            className="character-stat-card-fill attribute-fill"
            style={{
              width:
                `${progressPercent}%`,
              transition:
                'width 0.2s linear',
            }}
          />
        </div>
      )}
    </div>
  )
}