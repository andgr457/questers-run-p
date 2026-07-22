import type { NavigationEvents, NavigationEventTypes } from '../../navigation/types/NavigationEvents.types'

export type SiteEventType = NavigationEventTypes

export interface SiteEvent<T_EventMeta = unknown> {
  id: string
  parentEventId?: string
  type: SiteEventType
  created: number
  meta?: T_EventMeta

}
export type SiteEvents = NavigationEvents