import { useNavigate } from 'react-router-dom'
import type { Item } from '../../../interfaces/items/Item.types'
import type { QuestCompletionRequirement } from '../../../interfaces/quests/Quests.types'

interface Props {
  req: QuestCompletionRequirement
  item: Item
}

export default function QuestRequirementItem({ 
  req,
  item
}: Props) {
  if (!req.itemId || typeof req.itemAmount !== 'number') {
    return null
  }
  const navigate = useNavigate()

  const current = req.itemCharacterAmount ?? 0
  const total = req.itemAmount

  const checkOrX = req.completed ? '✔' : '✘'
  const clickFn = item?.profession?.type
    ? () => navigate(`/profession/${item?.profession?.type}#${item?.id}`)
    : () => {}
  return (
    <div
      title={req.itemDescription}
      className="quest-completion-req"
    >
      <div>{checkOrX}</div>

      <div className="quest-completion-req-amounts">
        {current} / {total}
      </div>

      <div className="quest-completion-req-name">
        {item?.name}
      </div>

      {item?.profession?.type && (
        <div className="quest-completion-req-nav-btn">
          <button className="basic" onClick={clickFn}>
            {item?.profession?.type}
          </button>
        </div>
      )}
    </div>
  )
}