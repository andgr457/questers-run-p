import type { CharacterEntity, CharacterGoldTransaction } from '../../../entity/character/types/CharacterEntity.types'
import type { PlayerEntity, PlayerGoldTransaction } from '../../../entity/player/types/PlayerEntity.types'
import type { OverlayMode } from '../../../game/context-menu/types/OverlayMode.types'

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

  meta?: ActivityMeta
}

export type ActivityMeta = {
  isDebugMode?: boolean
  worldMode?: OverlayMode
  // generic runtime values
  xp?: number
  gold?: number
  
  player?: PlayerEntity
  playerGoldTransaction?: PlayerGoldTransaction
  character?: CharacterEntity
  characterId?: string
  characterGoldTransaction?: CharacterGoldTransaction
}