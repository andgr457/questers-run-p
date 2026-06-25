import { useEffect, useState } from "react";
import NotifyItem from "./NotifyItem";
import styles from "./NotificationList.module.css";
import { notificationRuntimeService } from '../../engine/notifications/NotificationRuntimeService';
import type { GameNotification } from '../../engine/notifications/types/Notification.types';

export default function NotificationList() {
  const [items, setItems] = useState<GameNotification[]>([]);

  useEffect(() => {
    return notificationRuntimeService.subscribe(setItems);
  }, []);

  return (
    <div className={styles.container}>
      {items.map((n, i) => (
        <NotifyItem
          key={n.id}
          notification={n}
          index={i}
          onDone={notificationRuntimeService.remove.bind(notificationRuntimeService)}
        />
      ))}
    </div>
  );
}