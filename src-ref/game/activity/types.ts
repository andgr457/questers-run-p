import type { RouteResult } from '../world/worldRouting'
import type { WorldLocation } from '../world/worldState'

export type ActivityType =
  | 'hunting'
  | 'quest'
  | 'scouting'
  | 'gathering'
  | 'dungeon'
  | 'raid'
  | 'travel'
  | 'transition'

export type ActivityStatus =
  | 'active'
  | 'completed'
  | 'cancelled'

export type TravelPhase =
  | 'enter'
  | 'travel'
  | 'arrive'
  | 'exit'
  | 'complete'

export interface ActivityEntry {
  id: string
  characterId: string
  type: ActivityType
  startedAt: number
  status: ActivityStatus

  meta?: ActivityMeta
  blocking?: boolean
  duration: number
  completedAt?: number
}

export type ActivityMeta = {
  hunting?: {
    targetId?: string
    zoneId?: string
  }

  gathering?: {
    nodeId?: string
    quantity?: number
  }

  quest?: {
    questId?: string
    stepId?: string
  }

  dungeon?: {
    dungeonId?: string
    floor?: number
  }

  travel?: {
    from: WorldLocation
    to: WorldLocation
    route: RouteResult
    phase?: TravelPhase
  }
}
