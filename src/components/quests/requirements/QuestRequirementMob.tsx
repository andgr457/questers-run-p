import type { QuestCompletionRequirement } from '../../../interfaces/quests/Quests.types'
import { useNavigate } from 'react-router-dom'
import type { Mob } from '../../../interfaces/mobs/Mob.types'

interface Props {
  req: QuestCompletionRequirement
  mob: Mob
}

export default function QuestRequirementMob({ 
  req,
  mob
}: Props) {
  const navigate = useNavigate()

  if (!req.mobId || typeof req.mobAmount !== 'number') {
    return null
  }

  const current = req.mobCharacterAmount ?? 0
  const total = req.mobAmount

  const checkOrX = req.completed ? '✔' : '✘'

  const clickFn = mob.location
    ? () => navigate(`/hunting/${mob.location}#${mob.id}`)
    : () => {}

  return (
    <div
      title={mob?.description}
      className="quest-completion-req"
    >
      <div>{checkOrX}</div>

      <div className="quest-completion-req-amounts">
        {current} / {total}
      </div>

      <div className="quest-completion-req-name">
        {mob?.name} Lv. {mob?.level}
      </div>

      {mob.location && (
        <div className="quest-completion-req-nav-btn">
          <button className="basic" onClick={clickFn}>
            {mob.location}
          </button>
        </div>
      )}
    </div>
  )
}