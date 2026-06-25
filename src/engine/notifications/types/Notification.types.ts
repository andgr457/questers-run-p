import type { ReactNode } from 'react';

export type GameNotificationType = 'info' | 'error' | 'warning' | 'success'

export interface GameNotification {
  id: string;
  text: ReactNode;
  type: GameNotificationType;
  lifetime: number;
};
