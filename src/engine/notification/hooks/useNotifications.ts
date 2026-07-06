import { useEffect, useState } from "react";
import { notificationRuntimeService } from "../NotificationRuntimeService";
import type { Notification } from '../../../game/notification/types/Notification.types'
import { eventBus } from '../../event/EventBus';

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>(notificationRuntimeService.getNotifications());

  useEffect(() => {
    eventBus.subscribe(event => {
      if(event.type === 'notification:updated'){
        setNotifications(notificationRuntimeService.getNotifications())
      }
    })
  }, [])

  return {
    notifications,
  }
}