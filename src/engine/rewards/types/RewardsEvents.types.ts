import type { GameEvent } from '../../event/types/EventBus.types'

export type RewardsEventTypes =
  | 'rewards:grant'
  | 'rewards:granted'

export type RewardsSourceType =
  | 'tutorial'
  | 'quest'
  | 'achievement'
  | 'debug'
  | 'system'

export type RewardsTargetType =
  | 'player'
  | 'character'
  | 'characters'

export interface RewardBase {
  type: RewardsTargetType
  gold?: number
  xp?: number
  characterTokens?: number
}

export interface RewardsGrantMeta {
  rewardsBase: RewardBase[]
  source?: {
    type: RewardsSourceType
    eventId?: string
    characterId?: string
    partyId?: string
    tutorialId?: string
    questId?: string
  }
}

export interface GameEvent_RewardsGrant extends GameEvent {
  type: 'rewards:grant'
  meta: {
    rewards: RewardsGrantMeta
  }
}

export interface GameEvent_RewardsGranted extends GameEvent {
  type: 'rewards:granted'
  meta: {
    rewards: RewardsGrantMeta
  }
}

export type RewardsEvents =
  | GameEvent_RewardsGrant
  | GameEvent_RewardsGranted