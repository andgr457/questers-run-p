// NotificationList.tsx
import FloatingNotify from './FloatingNotify'
import './FloatingNotify.css'
import type { Notification } from './hooks/useFloatingNotify'

interface NotificationListProps {
  notifications: Notification[]
}

export default function NotificationList(props: NotificationListProps) {
  const {
    notifications
  } = props

  return (
    <div className="notification-list">
      {notifications.map((n) => (
        <FloatingNotify
          key={n.id}
          notification={n}
        />
      ))}
    </div>
  )
}