import { useEffect, useState } from "react";
import { notificationRuntimeService } from "../NotificationRuntimeService";
import type { Notification } from '../../../game/notification/types/Notification.types'
import { eventBus } from '../../event/EventBus';
import { GAME_EVENT_BUS_NOTIFICATION_TYPES } from '../data/NotificationEvents.data';

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>(notificationRuntimeService.getNotifications());

  useEffect(() => {
    eventBus.subscribe(event => {
      if(!GAME_EVENT_BUS_NOTIFICATION_TYPES.includes(event.type)) return
      
      if(event.type === 'notification:saved'){
        setNotifications(notificationRuntimeService.getNotifications())
      }
    })
  }, [])

  return {
    notifications,
  }
}