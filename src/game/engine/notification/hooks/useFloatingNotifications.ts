// hooks/useFloatingNotifications.ts

import { useEffect, useState } from 'react'
import type { FloatingNotify } from '../../../components/ui/notify/types/FloatingNotify.types'
import { notificationRuntimeService } from '../NotificationRuntimeService'

export function useFloatingNotifications() {
  const [notifications, setNotifications] =
    useState<FloatingNotify[]>([])

  useEffect(() => {
    return notificationRuntimeService.subscribe(
      (notification) => {
        setNotifications(prev => [
          ...prev,
          {
            id: notification.id,
            text: notification.text,
          },
        ])

        setTimeout(() => {
          setNotifications(prev =>
            prev.filter(
              n => n.id !== notification.id
            )
          )
        }, notification.lifetime ?? 2500)
      }
    )
  }, [])

  return {
    notifications,
  }
}