import type { CharacterEntity, CharacterGoldTransaction } from '../../../entity/character/types/CharacterEntity.types'
import type { Location } from '../../../entity/location/types/Location.types'
import type { PartyEntity } from '../../../entity/party/types/PartyEntity.types'
import type { PlayerEntity, PlayerGoldTransaction } from '../../../entity/player/types/PlayerEntity.types'
import type { OverlayMode } from '../../../game/context-menu/types/OverlayMode.types'
import type { TutorialReward } from '../../../game/tutorial/types/Tutorial.types'
import type { Transition } from '../../../ui/transition/types/Transition.types'

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

export type EventMeta = {
  isDebugMode?: boolean
  worldMode?: OverlayMode
  transition?: Transition
  destination?: Location
  departure?: Location

  xp?: number
  characterTokens?: number
  gold?: number

  player?: PlayerEntity
  playerGoldTransaction?: PlayerGoldTransaction
  
  character?: CharacterEntity
  characterId?: string
  characterGoldTransaction?: CharacterGoldTransaction
  characterIds?: string[]

  
  party?: PartyEntity
  partyId?: string
  
  tutorialId?: string
  tutorialRewards?: TutorialReward[]
}