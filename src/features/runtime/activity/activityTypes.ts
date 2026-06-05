export type ActivityType =
  | 'hunting'
  | 'quest'
  | 'scouting'
  | 'gathering'
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

  meta?: Record<string, any>
  blocking?: boolean
}