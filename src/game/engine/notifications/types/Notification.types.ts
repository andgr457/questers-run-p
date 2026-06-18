import type { ReactNode } from 'react';

export type NotificationType = 'info' | 'error' | 'warning' | 'success'

export interface Notification {
  id: string;
  text: ReactNode;
  type: NotificationType;
  lifetime: number;
};
