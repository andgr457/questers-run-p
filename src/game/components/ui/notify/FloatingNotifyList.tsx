import styles from './FloatingNotify.module.css'
import FloatingNotifyListEntity from './FloatingNotifyListEntity'
import type { FloatingNotify } from './types/FloatingNotify.types'

interface NotificationListProps {
  notifications: FloatingNotify[]
}

export default function FloatingNotifyEntityList(props: NotificationListProps) {
  const {
    notifications
  } = props

  return (
    <div className={styles.notificationList}>
      {notifications.map((n) => (
        <FloatingNotifyListEntity
          key={n.id}
          notification={n}
        />
      ))}
    </div>
  )
}