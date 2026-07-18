export interface Notification {
  id: string
  date: number
  title: string
  description?: string
  viewed: boolean
}

export interface NotificationEventAddMeta {
  title: string
  description: string
}