import { eventBus } from '../../../../engine/event/EventBus'
import { ContextMenuIcon } from '../../../context-menu/data/ContextMenuIcon.data'
import { formatPrimitiveValueToString } from '../../../utils/Game.utils'
import type { Notification } from '../../types/Notification.types'

import styles from './NotificationListItem.module.css'

interface Props {
  entity: Notification
}

export default function NotificationListItem(props: Props) {
  const { entity } = props

  return (
    <div className={styles.row}>
      <div className={styles.main}>
        <div className={styles.title}>
          {entity.title} @ {formatPrimitiveValueToString(entity.date, true)}
        </div>

        <div className={styles.description}>
          {entity.description}
        </div>
      </div>

      <div className={styles.description}>
        
      </div>
      <div>
        {entity.viewed === false && <div 
          title='Mark as Viewed' 
          className={styles.action}
          onClick={() => {
            eventBus.emit({
              id: crypto.randomUUID(),
              type: 'notification:viewed',
              meta: {
                notificationId: entity.id
              }
            })
          }}
        >
          {ContextMenuIcon.close}
        </div>}
      </div>
    </div>
  )
}