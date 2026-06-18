import { useEffect, useState } from "react";
import { notificationService } from "../NotificationService";
import type { Notification } from '../types/Notification.types'

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    return notificationService.subscribe(setNotifications);
  }, []);

  return {
    notifications,
    notify: notificationService.notify.bind(notificationService),
    remove: notificationService.remove.bind(notificationService)
  };
}