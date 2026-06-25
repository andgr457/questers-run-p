import { formatDateFromMillis } from '../../../../engine/clock/utils/formatTimeRemaining'
import type { EventHistoryItem } from '../../../../engine/event/types/EventHistory.types'

interface Props {
  entity: EventHistoryItem
}

export default function EventHistoryListItem(props: Props){
  const {
    entity,
  } = props
  return <>
    <div className='game-list-item-title'>
      {entity.title}
    </div>
    <div className='game-list-item-label'>
      {entity.description}
    </div>
    <div className='game-list-item-label'>
      {formatDateFromMillis(entity.date)}
    </div>
  </>
}