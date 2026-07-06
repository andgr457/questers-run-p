import type { CharacterEntity, CharacterGoldTransaction } from '../../../entity/character/types/CharacterEntity.types'
import type { Location } from '../../../entity/location/types/Location.types'
import type { PartyEntity } from '../../../entity/party/types/PartyEntity.types'
import type { PlayerEntity, PlayerGoldTransaction } from '../../../entity/player/types/PlayerEntity.types'
import type { OverlayMode } from '../../../game/context-menu/types/OverlayMode.types'
import type { Transition } from '../../../ui/transition/types/Transition.types'
import type { RewardsGrantMeta } from '../../rewards/types/RewardsEvents.types'

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
  transition?: Transition
  destination?: Location
  departure?: Location

  xp?: number
  gold?: number
  
  player?: PlayerEntity
  playerGoldTransaction?: PlayerGoldTransaction
  characterTokens?: number
  
  character?: CharacterEntity
  characterId?: string
  characterGoldTransaction?: CharacterGoldTransaction

  party?: PartyEntity
  partyId?: string

  rewards?: RewardsGrantMeta
  tutorialId?: string
}