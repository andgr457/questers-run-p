import type { EventMeta } from '../../event/types/EventBus.types'

export type ActivityType =
  | 'hunting'
  | 'questing'
  | 'gathering'
  | 'mining'
  | 'cooking'
  | 'crafting'
  | 'dungeon'
  | 'raid'
  | 'resting'

export type ActivityStatus =
  | 'active'
  | 'completed'
  | 'cancelled'

export interface ActivityEntry {
  id: string
  eventId?: string
  characterId: string
  type: ActivityType
  startedAt: number
  status: ActivityStatus
  blocking?: boolean
  blockingAll?: boolean
  duration: number
  continuous: boolean
  completedAt?: number

  meta?: EventMeta
}

