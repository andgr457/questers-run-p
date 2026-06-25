import { useEffect, useState } from "react";
import { notificationRuntimeService } from "../NotificationRuntimeService";
import type { GameNotification } from '../types/Notification.types'

export function useNotifications() {
  const [notifications, setNotifications] = useState<GameNotification[]>([]);

  useEffect(() => {
    return notificationRuntimeService.subscribe(setNotifications);
  }, []);

  return {
    notifications,
    notify: notificationRuntimeService.notify.bind(notificationRuntimeService),
    remove: notificationRuntimeService.remove.bind(notificationRuntimeService)
  };
}