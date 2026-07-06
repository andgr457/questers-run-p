import type { GameEvent } from '../../event/types/EventBus.types'

export type TutorialEventTypes =
  | 'tutorial:updated'
  | 'tutorial:complete'
  | 'tutorial:completed'

export interface GameEvent_TutorialUpdated extends GameEvent {
  type: 'tutorial:updated'
}

export interface GameEvent_TutorialComplete extends GameEvent {
  type: 'tutorial:complete'
  meta: {
    tutorialId: string
  }
}

export interface GameEvent_TutorialCompleted extends GameEvent {
  type: 'tutorial:completed'
  meta: {
    tutorialId: string
  }
}

export type TutorialEvents =
  | GameEvent_TutorialUpdated
  | GameEvent_TutorialComplete
  | GameEvent_TutorialCompleted