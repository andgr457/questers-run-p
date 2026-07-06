import { formatDateFromMillis } from '../../../../engine/clock/utils/formatTimeRemaining'
import type { Notification } from '../../types/Notification.types'

interface Props {
  entity: Notification
}

export default function NotificationListItem(props: Props){
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