import { useState, useCallback } from "react";

export type Notification = {
  id: string;
  text: string;
  icon?: string;
};

export function useFloatingNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((text: string, icon?: string, lifetime = 3000) => {
    const id = (Date.now() + Math.random()).toString();

    setNotifications(prev => [...prev, { id, text, icon }]);

    // Auto-remove after lifetime
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, lifetime);
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  return { notifications, addNotification, removeNotification };
}