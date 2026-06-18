import { useEffect, useState } from "react";
import styles from "./NotifyItem.module.css";
import type { Notification } from '../../../engine/notifications/types/Notification.types';

interface Props {
  notification: Notification;
  index: number;
  onDone: (id: string) => void;
}

export default function NotifyItem({
  notification,
  index,
  onDone
}: Props) {
  const { id, text, type: alertType } = notification;

  const [state, setState] = useState<"enter" | "visible" | "exit">("enter");

  // enter animation
  useEffect(() => {
    const t = window.setTimeout(() => {
      setState("visible");
    }, 20);

    return () => clearTimeout(t);
  }, []);

  // exit trigger (visual only, service still owns lifecycle)
  useEffect(() => {
    const exitDelay = window.setTimeout(() => {
      setState("exit");
    }, notification.lifetime - 250);

    return () => clearTimeout(exitDelay);
  }, [notification.lifetime]);

  const handleTransitionEnd = () => {
    if (state === "exit") {
      onDone(id);
    }
  };

  return (
    <div
      className={[
        styles.item,
        styles[alertType],
        styles[state]
      ].join(" ")}
      style={{
        transform: `translateY(${index * 10}px)`
      }}
      onTransitionEnd={handleTransitionEnd}
    >
      {text}
    </div>
  );
}