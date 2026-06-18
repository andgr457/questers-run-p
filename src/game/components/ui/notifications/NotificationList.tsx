import { useEffect, useState } from "react";
import NotifyItem from "./NotifyItem";
import styles from "./NotificationList.module.css";
import { notificationService } from '../../../engine/notifications/NotificationService';
import type { Notification } from '../../../engine/notifications/types/Notification.types';

export default function NotificationList() {
  const [items, setItems] = useState<Notification[]>([]);

  useEffect(() => {
    return notificationService.subscribe(setItems);
  }, []);

  return (
    <div className={styles.container}>
      {items.map((n, i) => (
        <NotifyItem
          key={n.id}
          notification={n}
          index={i}
          onDone={notificationService.remove.bind(notificationService)}
        />
      ))}
    </div>
  );
}