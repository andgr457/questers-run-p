
export type ActivityType =
  | 'hunting'
  | 'quest'
  | 'profession'
  | 'crafting'
  | 'dungeon'
  | 'raid'

export type ActivityStatus =
  | 'active'
  | 'completed'
  | 'cancelled'

export interface ActivityEntry {
  id: string
  characterId: string
  type: ActivityType
  startedAt: number
  status: ActivityStatus
  blocking?: boolean
  duration: number
  completedAt?: number

  meta?: ActivityMeta
}

export type ActivityMeta = {
  
}
