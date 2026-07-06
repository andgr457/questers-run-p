import { formatDateFromMillis } from '../../../../engine/clock/utils/formatTimeRemaining'
import { notificationRuntimeService } from '../../../../engine/notification/NotificationRuntimeService'
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
          {entity.title}
        </div>

        <div className={styles.description}>
          {entity.description}
        </div>
      </div>

      <div className={styles.time}>
        {formatDateFromMillis(entity.date)}
      </div>
      {entity.viewed === false && <div 
        title='Mark as Viewed' 
        className={styles.action}
        onClick={() => {
          notificationRuntimeService.markViewed(entity.id)
        }}
      >
        👁
      </div>}
      {entity.viewed === true && <div
        title='Already Marked as Viewed.'
        className={styles.action}
      >
        ⊖
      </div>}
    </div>
  )
}