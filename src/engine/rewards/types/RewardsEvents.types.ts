import type { TutorialReward } from '../../../game/tutorial/types/Tutorial.types'
import type { GameEvent } from '../../event/types/EventBus.types'

export type RewardsEventTypes =
  | 'rewards:start'
  | 'rewards:completed'

export interface GameEvent_RewardsStart extends GameEvent {
  type: 'rewards:start'
  meta: {
    tutorialRewards?: TutorialReward[]
    characterId?: string
  }
}

export interface GameEvent_RewardsCompleted extends GameEvent {
  type: 'rewards:completed'
  meta: {
    tutorialRewards?: TutorialReward[]
  }
}

export type RewardsEvents =
  | GameEvent_RewardsStart
  | GameEvent_RewardsCompleted